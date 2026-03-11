# API Routes for CarbonLens

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from api.schemas import AnalyzeRequest, AnalyzeResponse
import uuid

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    """
    Main endpoint: takes structured factory data, returns per-product CO2e estimates.
    For document upload flow, use /analyze/upload instead.
    """
    # TODO: Member 1 — wire disaggregation engine here
    # TODO: Member 2 — wire emission factor lookup here
    raise HTTPException(status_code=501, detail="Not implemented yet")

@router.post("/analyze/upload")
async def analyze_upload(files: list[UploadFile] = File(...)):
    """
    Upload endpoint: accepts PDF/CSV documents, extracts data via LLM, then analyzes.
    """
    # TODO: Member 3 — wire document_handler + llm_parser here, then call analyze()
    job_id = str(uuid.uuid4())
    return {"job_id": job_id, "status": "processing"}

@router.get("/export/pdf/{job_id}")
async def export_pdf(job_id: str):
    """Returns PDF report for a completed analysis job."""
    # TODO: Member 5 — wire pdf_generator here
    raise HTTPException(status_code=501, detail="Not implemented yet")

@router.get("/export/cbam/{job_id}")
async def export_cbam(job_id: str):
    """Returns CBAM-formatted JSON export for a completed analysis job."""
    # TODO: Member 5 — wire cbam_export here
    raise HTTPException(status_code=501, detail="Not implemented yet")
