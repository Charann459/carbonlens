# 🌍 CarbonLens v0.1.0

> **AI-Based Carbon Footprint Analyzer** — Energy Conservation Week Hackathon 2026  
> Solving the data-dark Tier 3 supplier problem for CBAM-compliant supply chains

---

## The Problem

A forging unit in Rajkot supplies crankshafts to a German OEM. Since January 2026, that OEM legally needs the **embedded carbon per part** for EU CBAM compliance. But the factory has one electricity meter, one material invoice, zero sub-metering.

The data structurally cannot exist — until now.

## The Solution

Upload your factory's electricity bill, material receipt, and production log.  
CarbonLens disaggregates factory-level totals into **per-product CO₂e estimates** using physics-informed Bayesian inference — no sub-metering, no ESG team required.

```
PDF / CSV / TXT Upload
        ↓
LLM Extraction  (Groq llama-3.3-70b — unstructured → structured JSON)
        ↓
Energy Attribution  (BEE India SEC benchmarks, proportional allocation)
        ↓
Material Attribution  (yield coefficients, conservation-constrained)
        ↓
Bayesian Monte Carlo  (N=1000, ±15% SEC uncertainty → P5/P50/P95)
        ↓
Per-product CO₂e + Confidence Interval + Scope 1/2 Split
        ↓
PDF Report  |  CBAM-v1.0 JSON  |  Reduction Recommendations
```

---

## Live Demo

```bash
git clone https://github.com/Medinz01/carbonlens.git
cd carbonlens
cp .env.example .env          # add your GROQ_API_KEY
docker compose up --build
```

- Frontend: http://localhost:5173  
- Backend API: http://localhost:8000  
- Health check: http://localhost:8000/health/llm

**No upload needed to try it** — click **⚡ Try Demo** on the upload page to run the built-in Rajkot forging unit scenario instantly.

---

## Key Features

| Feature | Description |
|---|---|
| **LLM Extraction** | Groq llama-3.3-70b parses unstructured factory docs — electricity bills, production logs, material receipts |
| **Bayesian Disaggregation** | Physics-constrained Monte Carlo allocates factory totals to product lines |
| **Scope 1 / Scope 2 Split** | Per-product breakdown of material vs grid electricity emissions |
| **Confidence Intervals** | P5–P95 range on every estimate — honest uncertainty, not fake precision |
| **CBAM JSON Export** | Schema-compliant export with HS codes, embedded emissions, intensity, methodology reference |
| **PDF Report** | Audit-ready report with full verification formulas — every number reproducible by hand |
| **Reduction Recommendations** | Solar, green tariff, yield improvement, hotspot audit — sorted by CO₂e saving potential |
| **Grid Region Selector** | 14 regions: India national/regional/state + China provincial grid EFs |
| **HS Code Auto-Suggest** | Keyword fallback for 25 common MSME part types when LLM extraction misses it |
| **Try Demo Button** | One-click demo with hardcoded Rajkot factory — works even if Groq is down |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/analyze/upload` | Upload PDF/CSV/TXT, returns job with products + recommendations |
| `POST` | `/analyze` | Structured JSON input |
| `GET` | `/demo` | Run built-in Rajkot demo — no upload needed |
| `GET` | `/jobs/{job_id}` | Poll job results |
| `GET` | `/export/cbam/{job_id}` | Download CBAM-v1.0 JSON |
| `GET` | `/export/pdf/{job_id}` | Download PDF report |
| `GET` | `/health/llm` | Groq connectivity check |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Recharts + TailwindCSS + Vite |
| Backend | Python 3.12 + FastAPI |
| LLM | Groq API — `llama-3.3-70b-versatile` (free tier) |
| PDF | ReportLab |
| Disaggregation | NumPy — Bayesian Monte Carlo |
| Data | BEE India SEC benchmarks, CEA grid factors, IPCC/World Steel material EFs |
| Deployment | Docker Compose (2 containers: backend + frontend) |

---

## Repo Structure

```
carbonlens/
├── backend/
│   ├── api/
│   │   ├── routes.py                    # All API endpoints + job store
│   │   └── schemas.py                   # Pydantic schemas
│   ├── core/
│   │   ├── extraction/
│   │   │   ├── llm_parser.py            # Groq API extraction
│   │   │   └── document_handler.py      # PDF/CSV/TXT handling
│   │   ├── disaggregation/
│   │   │   ├── energy_attribution.py    # SEC-weighted energy allocation
│   │   │   ├── material_attribution.py  # Yield-based material allocation
│   │   │   └── bayesian_engine.py       # Monte Carlo fusion + confidence
│   │   ├── emission_factors/
│   │   │   ├── sec_lookup.py            # BEE SEC benchmarks
│   │   │   └── factor_db.py             # Grid + material emission factors
│   │   ├── recommendations.py           # Reduction pathway engine
│   │   └── hs_lookup.py                 # HS code keyword fallback
│   └── utils/
│       ├── pdf_generator.py             # PDF with formulas + worked examples
│       └── cbam_export.py               # CBAM schema helper
├── frontend/src/
│   ├── components/
│   │   ├── UploadForm.jsx               # Upload + Try Demo + grid selector
│   │   ├── ResultCard.jsx               # Per-product card + scope split + tooltip
│   │   ├── FactorySummary.jsx           # Factory total + hotspot card
│   │   ├── ConfidenceChart.jsx          # Recharts bar chart with error bars
│   │   ├── RecommendationsPanel.jsx     # Reduction pathways, collapsible
│   │   └── ExportPanel.jsx              # PDF + CBAM download buttons
│   └── utils/api.js                     # All backend calls
├── data/
│   ├── sec_benchmarks/                  # BEE India JSON benchmarks
│   └── sample_inputs/                   # Test factory data
├── docs/
│   ├── ALGORITHM.md                     # Full disaggregation algorithm
│   ├── ARCHITECTURE.md                  # System design
│   ├── CBAM_SCHEMA.md                   # CBAM field reference
│   └── DESIGN.md                        # Design decisions + assumptions
├── .env.example
└── docker-compose.yml
```

---

## Environment Variables

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx     # From console.groq.com (free)
GROQ_MODEL=llama-3.3-70b-versatile
DEFAULT_GRID_REGION=india_national
DEBUG=true
```

---

## Algorithm Summary

**Step 1 — Extract:** LLM parses document → `{total_kwh, materials, products[]}`  
**Step 2 — Energy weight:** `w_i = SEC_i × Q_i × unit_weight_i`  
**Step 3 — Allocate:** `kWh_i = total_kWh × (w_i / Σw_j)`  
**Step 4 — Material:** `mat_i = unit_weight_i / yield` (scaled to factory total)  
**Step 5 — Monte Carlo:** `SEC ~ Normal(μ, σ=0.15μ)`, N=1000 draws → P5/P50/P95  
**Step 6 — Emit:** `CO₂e = kWh × 0.716 + mat × 0.43` (India grid + scrap steel)

Full derivation: [`docs/ALGORITHM.md`](docs/ALGORITHM.md)

---

## Emission Factors Used

| Parameter | Value | Source |
|---|---|---|
| India national grid | 0.716 kgCO₂e/kWh | CEA India 2023 |
| Mild steel (scrap) | 0.43 kgCO₂e/kg | IPCC AR6 / World Steel 2023 |
| Mild steel (primary) | 1.85 kgCO₂e/kg | IPCC AR6 / World Steel 2023 |
| Forging yield | 85% | BEE India SME cluster report |
| SEC uncertainty | ±15% | BEE variance data |

---

## CBAM Compliance Note

Output fields map to EU CBAM declarant portal requirements (definitive phase, Jan 2026).  
Calculation method declared as `physics_informed_bayesian_disaggregation` — qualifies under Article 4(3) estimated method provision.  
Carbon price paid: EUR 0 (India has no national ETS as of 2026).

---

`v0.1.0` — Hackathon MVP · Energy Conservation Week 2026 · Syntax Squad