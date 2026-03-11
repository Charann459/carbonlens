# 🌍 CarbonLens v0.1.0

> AI-Based Carbon Footprint Analyzer for Organizations — Hackathon MVP

CarbonLens uses **LLM-powered document extraction** and **physics-informed Bayesian disaggregation** to generate per-product carbon footprint estimates for manufacturing organizations that lack granular energy data.

---

## The Problem

Tier 3 manufacturers (forging/casting units in clusters like Rajkot) supply EU OEMs but cannot provide per-product carbon data — not due to negligence, but because they operate with a single electricity bill, bulk material purchases, and zero sub-metering. With EU CBAM now in its definitive phase (Jan 2026), this creates a critical compliance gap for the entire supply chain.

## The Solution

Upload your factory's electricity bill, material invoices, and production log. CarbonLens does the rest:

```
Document Upload (PDF/CSV)
        ↓
LLM Extraction (Claude API)
        ↓
Disaggregation Engine (Bayesian)
        ↓
Emission Factor DB (BEE/IPCC benchmarks)
        ↓
Per-product CO₂e + Confidence Range
        ↓
PDF Report + CBAM JSON Export + UI Visualization
```

---

## Repo Structure

```
carbonlens/
├── backend/
│   ├── main.py                          # FastAPI app entry point
│   ├── requirements.txt
│   ├── api/
│   │   ├── routes.py                    # API endpoints
│   │   └── schemas.py                   # Request/response schemas
│   ├── core/
│   │   ├── extraction/
│   │   │   ├── llm_parser.py            # LLM document extraction (Claude API)
│   │   │   └── document_handler.py      # File handling, preprocessing
│   │   ├── disaggregation/
│   │   │   ├── energy_attribution.py    # Energy allocation per product line
│   │   │   ├── material_attribution.py  # Material/yield disaggregation
│   │   │   └── bayesian_engine.py       # Bayesian fusion + uncertainty quant
│   │   └── emission_factors/
│   │       ├── sec_lookup.py            # SEC benchmark lookup by process+material
│   │       └── factor_db.py             # Emission factor database interface
│   ├── models/
│   │   ├── factory_input.py             # Pydantic input models
│   │   └── carbon_output.py             # Pydantic output models
│   ├── utils/
│   │   ├── pdf_generator.py             # PDF report generation
│   │   └── cbam_export.py               # CBAM-formatted JSON export
│   └── tests/
│       ├── test_disaggregation.py
│       └── test_extraction.py
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── UploadForm.jsx           # Document upload interface
│       │   ├── ResultCard.jsx           # Per-product result display
│       │   ├── ConfidenceChart.jsx      # Confidence interval visualization
│       │   └── ExportPanel.jsx          # PDF + CBAM export buttons
│       ├── pages/
│       │   ├── Home.jsx
│       │   └── Results.jsx
│       └── utils/
│           └── api.js                   # Backend API calls
├── data/
│   ├── sec_benchmarks/
│   │   ├── forging.json                 # BEE SEC benchmarks - forging
│   │   ├── casting.json                 # BEE SEC benchmarks - casting
│   │   └── stamping.json                # BEE SEC benchmarks - stamping
│   └── sample_inputs/
│       └── sample_factory_input.json
├── docs/
│   ├── ARCHITECTURE.md
│   ├── ALGORITHM.md
│   ├── CBAM_SCHEMA.md
│   └── DESIGN.md
├── .env.example
├── .gitignore
└── docker-compose.yml
```

---

## Quickstart

```bash
git clone https://github.com/your-org/carbonlens.git
cd carbonlens

# Backend
cd backend
pip install -r requirements.txt
cp ../.env.example ../.env
uvicorn main:app --reload

# Frontend
cd ../frontend
npm install
npm run dev
```

---

## Team Roles (v0.1.0)

| Member | Module |
|--------|--------|
| Member 1 | Disaggregation Engine |
| Member 2 | Emission Factor DB + SEC Benchmarks |
| Member 3 | FastAPI Backend + API Layer |
| Member 4 | React Frontend |
| Member 5 | PDF + CBAM Export + Docs |

---

`v0.1.0` — Hackathon MVP · Energy Conservation Week 2026
