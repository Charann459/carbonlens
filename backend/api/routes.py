# API Routes for CarbonLens — fully wired

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from api.schemas import AnalyzeRequest, AnalyzeResponse
import uuid, json, os

router = APIRouter()

# ── In-memory job store (sufficient for hackathon demo) ──────────────────────
JOB_STORE: dict[str, dict] = {}


# ── Helper: run full disaggregation pipeline ─────────────────────────────────
def _run_pipeline(factory_data: dict) -> dict:
    from core.disaggregation.energy_attribution import attribute_energy
    from core.disaggregation.material_attribution import attribute_material
    from core.disaggregation.bayesian_engine import compute_carbon_estimates

    products = factory_data.get("products", [])
    total_kwh = factory_data.get("energy", {}).get("total_kwh") or 0
    total_material_kg = sum(
        m.get("quantity_kg") or 0 for m in factory_data.get("materials", [])
    )
    grid_region = factory_data.get("grid_region", "india_national")

    energy_results = attribute_energy(total_kwh, products)
    material_results = attribute_material(total_material_kg, products)
    carbon_results = compute_carbon_estimates(
        energy_results, material_results, total_kwh, grid_zone=grid_region
    )
    return {
        "products": carbon_results,
        "total_kwh": total_kwh,
        "total_material_kg": total_material_kg,
    }


# ── POST /analyze — structured JSON input ────────────────────────────────────
@router.post("/analyze")
async def analyze(request: AnalyzeRequest):
    job_id = str(uuid.uuid4())
    try:
        result = _run_pipeline(request.dict())
        from core.recommendations import generate_recommendations
        total_kwh = request.dict().get("energy", {}).get("total_kwh") or 0
        result["recommendations"] = generate_recommendations(result["products"], total_kwh)
        JOB_STORE[job_id] = {"status": "complete", "result": result}
        return {"job_id": job_id, "status": "complete", **result}
    except Exception as e:
        JOB_STORE[job_id] = {"status": "error", "error": str(e)}
        raise HTTPException(status_code=500, detail=str(e))


# ── POST /analyze/upload — PDF/CSV document upload ───────────────────────────
@router.post("/analyze/upload")
async def analyze_upload(files: list[UploadFile] = File(...), grid_region: str = "india_national"):
    from core.extraction.document_handler import handle_upload, merge_extractions

    job_id = str(uuid.uuid4())
    JOB_STORE[job_id] = {"status": "processing"}

    try:
        extractions = []
        for f in files:
            extracted = await handle_upload(f)
            extractions.append(extracted)

        factory_data = merge_extractions(extractions) if extractions else {}
        factory_data["grid_region"] = grid_region

        # Normalise product fields — fill in missing keys required by pipeline
        for i, product in enumerate(factory_data.get("products", [])):
            # id — required by bayesian_engine
            if "id" not in product:
                product["id"] = product.get("product_id", f"P{i+1:03d}")
            # process
            if "process" not in product:
                product["process"] = product.get("process_hint", "forging")
            # material
            if "material" not in product:
                product["material"] = "mild_steel"
            # unit_weight_kg — required for energy attribution
            if "unit_weight_kg" not in product or not product["unit_weight_kg"]:
                product["unit_weight_kg"] = 2.0  # conservative default
            # quantity_units
            if "quantity_units" not in product or not product["quantity_units"]:
                product["quantity_units"] = 1
            # hs_code — auto-suggest if LLM didn't extract one
            if not product.get("hs_code"):
                from core.hs_lookup import suggest_hs_code
                product["hs_code"] = suggest_hs_code(product.get("description", ""))

        result = _run_pipeline(factory_data)

        # Generate reduction recommendations
        from core.recommendations import generate_recommendations
        total_kwh = factory_data.get("energy", {}).get("total_kwh") or 0
        recommendations = generate_recommendations(result["products"], total_kwh)
        result["recommendations"] = recommendations

        JOB_STORE[job_id] = {"status": "complete", "result": result, "extracted": factory_data}
        return {"job_id": job_id, "status": "complete", **result}

    except Exception as e:
        JOB_STORE[job_id] = {"status": "error", "error": str(e)}
        raise HTTPException(status_code=500, detail=str(e))


# ── GET /jobs/{job_id} — poll job results ────────────────────────────────────
@router.get("/jobs/{job_id}")
async def get_job(job_id: str):
    job = JOB_STORE.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found")
    return {"job_id": job_id, **job}


# ── GET /export/cbam/{job_id} — CBAM JSON download ───────────────────────────
@router.get("/export/cbam/{job_id}")
async def export_cbam(job_id: str):
    job = JOB_STORE.get(job_id)
    if not job or job.get("status") != "complete":
        raise HTTPException(status_code=404, detail="Job not found or not complete")

    products = job["result"]["products"]
    cbam_payload = {
        "schema_version": "CBAM-v1.0",
        "carbonlens_version": "0.1.0",
        "job_id": job_id,
        "goods": [
            {
                "hs_code": p.get("hs_code", ""),
                "description": p.get("description", ""),
                "country_of_origin": "IN",
                "net_mass_tonnes": p.get("net_mass_tonnes", 0),
                "embedded_emissions_tco2e": round(p["co2e_estimate"] / 1000, 4),
                "emissions_intensity_tco2e_per_tonne": p.get("intensity_estimate", 0),
                "emissions_min_tco2e": round(p["co2e_min"] / 1000, 4),
                "emissions_max_tco2e": round(p["co2e_max"] / 1000, 4),
                "confidence_pct": p.get("confidence_pct", 0),
                "emissions_scope": "direct",
                "calculation_method": p.get("methodology", "physics_informed_bayesian_disaggregation"),
                "methodology_reference": "CarbonLens v0.1.0 — docs/ALGORITHM.md",
                "carbon_price_paid_eur": 0,
            }
            for p in products
        ],
    }
    return JSONResponse(content=cbam_payload, headers={
        "Content-Disposition": f"attachment; filename=cbam_{job_id[:8]}.json"
    })


# ── GET /export/pdf/{job_id} — PDF report download ───────────────────────────
@router.get("/export/pdf/{job_id}")
async def export_pdf(job_id: str):
    job = JOB_STORE.get(job_id)
    if not job or job.get("status") != "complete":
        raise HTTPException(status_code=404, detail="Job not found or not complete")

    try:
        from utils.pdf_generator import generate_pdf
        from fastapi.responses import Response
        products = job["result"]["products"]
        pdf_bytes = generate_pdf(job_id, products)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=carbonlens_{job_id[:8]}.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {e}")

# ── GET /demo — run sample Rajkot factory data, no upload required ────────────
@router.get("/demo")
async def run_demo():
    """Runs the built-in sample factory (Rajkot forging unit, Feb 2026)."""
    demo_data = {
        "grid_region": "gujarat",
        "energy": {"total_kwh": 48000},
        "materials": [{"type": "mild_steel_billet", "quantity_kg": 42000, "assumed_scrap_based": True}],
        "products": [
            {"id": "P001", "description": "Crankshaft blank",  "hs_code": "8483.10",
             "process": "forging", "material": "mild_steel", "quantity_units": 1200, "unit_weight_kg": 4.2},
            {"id": "P002", "description": "Suspension arm",    "hs_code": "8708.80",
             "process": "forging", "material": "mild_steel", "quantity_units": 800,  "unit_weight_kg": 6.8},
            {"id": "P003", "description": "Brake bracket",     "hs_code": "8708.40",
             "process": "forging", "material": "mild_steel", "quantity_units": 2100, "unit_weight_kg": 1.9},
            {"id": "P004", "description": "Hub carrier blank", "hs_code": "8708.50",
             "process": "forging", "material": "mild_steel", "quantity_units": 450,  "unit_weight_kg": 8.5},
        ]
    }
    job_id = str(uuid.uuid4())
    JOB_STORE[job_id] = {"status": "processing"}
    try:
        result = _run_pipeline(demo_data)
        from core.recommendations import generate_recommendations
        result["recommendations"] = generate_recommendations(result["products"], 48000)
        JOB_STORE[job_id] = {"status": "complete", "result": result}
        return {"job_id": job_id, "status": "complete", "is_demo": True, **result}
    except Exception as e:
        JOB_STORE[job_id] = {"status": "error", "error": str(e)}
        raise HTTPException(status_code=500, detail=str(e))