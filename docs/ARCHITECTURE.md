# CarbonLens — System Architecture

## Overview

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (React)                  │
│  UploadForm → ResultCard → ConfidenceChart          │
│                   ExportPanel                       │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP (multipart + JSON)
┌──────────────────────▼──────────────────────────────┐
│               BACKEND (FastAPI)                     │
│  POST /analyze   GET /export/pdf   GET /export/cbam │
└──────────────────────┬──────────────────────────────┘
                       │
        ┌──────────────▼──────────────┐
        │     EXTRACTION LAYER        │
        │  document_handler.py        │
        │  llm_parser.py (Claude API) │
        │                             │
        │  Input: PDF/CSV/image        │
        │  Output: Structured JSON    │
        │  {energy_kwh, materials,    │
        │   machines, products}       │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │   DISAGGREGATION ENGINE     │
        │                             │
        │  energy_attribution.py      │
        │  → allocates total kWh      │
        │    per product line         │
        │                             │
        │  material_attribution.py    │
        │  → allocates bulk material  │
        │    per product via yield    │
        │                             │
        │  bayesian_engine.py         │
        │  → fuses both, constrains   │
        │    to factory totals,       │
        │    outputs confidence range │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │    EMISSION FACTOR DB       │
        │                             │
        │  sec_lookup.py              │
        │  → process + material →     │
        │    kWh/tonne benchmark      │
        │                             │
        │  factor_db.py               │
        │  → kgCO₂e per kWh (grid)   │
        │  → kgCO₂e per kg material  │
        │  Sources: BEE, IPCC, DEFRA  │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │         OUTPUT              │
        │                             │
        │  Per product:               │
        │  - CO₂e min/max (kg)        │
        │  - Confidence %             │
        │  - Methodology notes        │
        │                             │
        │  Exports:                   │
        │  - PDF Report               │
        │  - CBAM JSON                │
        └─────────────────────────────┘
```

## Key Design Decisions

1. **LLM only for extraction, not calculation** — Claude API understands unstructured documents. All math is deterministic Python. No hallucinated emission numbers.

2. **Bayesian constraint** — All product allocations must sum exactly to factory totals. No phantom emissions created.

3. **Confidence range over point estimate** — Honest output. A range with 75% confidence is more defensible to CBAM auditors than a fake precise number.

4. **Open emission factors** — All SEC benchmarks sourced from public BEE/IPCC data and stored in `/data/sec_benchmarks/`. Fully auditable.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/analyze` | Upload documents, returns carbon estimates |
| GET | `/export/pdf/{job_id}` | Download PDF report |
| GET | `/export/cbam/{job_id}` | Download CBAM JSON |
| GET | `/health` | Health check |
