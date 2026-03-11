# CarbonLens v0.1.0 — GitHub Issues

Create these issues on GitHub before the hackathon starts.
Each member picks their labeled issues and starts immediately.

---

## 🏷️ Labels to create first
- `member-1` (red)
- `member-2` (orange)  
- `member-3` (blue)
- `member-4` (green)
- `member-5` (purple)
- `core` (dark)
- `blocked` (yellow)

---

## MEMBER 1 — Disaggregation Engine

### Issue #1: Implement energy_attribution.py
**Label:** member-1, core
**File:** `backend/core/disaggregation/energy_attribution.py`
Scaffold is written. Implement and test the `attribute_energy()` function.
- Load SEC benchmarks via `get_sec_benchmark()`
- Compute energy weights per product
- Allocate total_kwh proportionally
- Return list of products with `allocated_kwh_per_unit`
- **Test:** with sample_factory_input.json, all allocations must sum to total_kwh

### Issue #2: Implement material_attribution.py
**Label:** member-1, core
**File:** `backend/core/disaggregation/material_attribution.py`
- Implement `attribute_material()` function
- Use `get_yield_coefficient()` per process+material
- Apply scale factor so allocations sum to total_material_kg
- **Test:** Σ(gross_per_unit × quantity) ≈ total_material_kg

### Issue #3: Implement bayesian_engine.py
**Label:** member-1, core  
**File:** `backend/core/disaggregation/bayesian_engine.py`
- Scaffold is written. Run Monte Carlo (N=1000) over SEC distributions
- Fuse energy CO2e + material CO2e per product
- Output P5/P50/P95 confidence intervals
- Implement `_compute_confidence()` heuristic
- **Test:** confidence should be 60–95%, never outside this range

### Issue #4: Write test_disaggregation.py
**Label:** member-1
**File:** `backend/tests/test_disaggregation.py`
- Test with sample_factory_input.json
- Assert energy conservation: Σallocations = total_kwh
- Assert all confidence values in valid range
- Assert CO2e values are positive

---

## MEMBER 2 — Emission Factor DB + SEC Benchmarks

### Issue #5: Verify and extend SEC benchmark data
**Label:** member-2, core
**Files:** `data/sec_benchmarks/forging.json`, `casting.json`, `stamping.json`
- Verify all existing values against BEE published norms
- Add machining.json process (milling, turning, grinding)
- Add yield coefficients for all missing material+process combos
- Source: BEE India SME cluster reports (search "BEE energy benchmarks forging")

### Issue #6: Implement sec_lookup.py fuzzy matching
**Label:** member-2, core
**File:** `backend/core/emission_factors/sec_lookup.py`
- Improve fuzzy material matching — "steel" should map to "mild_steel" default
- Add `list_available_processes()` and `list_available_materials(process)` helpers
- Handle unknown process gracefully with logged warning

### Issue #7: Extend factor_db.py with regional India grids
**Label:** member-2
**File:** `backend/core/emission_factors/factor_db.py`
- Add state-level grid emission factors for Gujarat, Maharashtra, Tamil Nadu, Punjab
- Source: CEA CO2 Baseline Database 2023
- Add China provincial averages for at least 5 major manufacturing provinces

### Issue #8: Write test_extraction.py
**Label:** member-2
**File:** `backend/tests/test_extraction.py`
- Mock the Claude API call (don't use real API in tests)
- Test that SEC lookup returns valid dict for all process+material combos in sample data
- Test fallback for unknown process

---

## MEMBER 3 — FastAPI Backend + API Layer

### Issue #9: Implement /analyze endpoint
**Label:** member-3, core
**File:** `backend/api/routes.py`
Wire the full pipeline in `analyze()`:
1. Call `attribute_energy()` (Member 1)
2. Call `attribute_material()` (Member 1)
3. Call `compute_carbon_estimates()` (Member 1)
4. Return `AnalyzeResponse`
**Blocked by:** Issues #1, #2, #3

### Issue #10: Implement /analyze/upload endpoint
**Label:** member-3, core
**File:** `backend/api/routes.py`
- Accept multipart file upload
- Call `handle_upload()` for each file
- Call `merge_extractions()` if multiple files
- Map extracted data to `AnalyzeRequest` schema
- Call analyze pipeline
**Blocked by:** Issue #9

### Issue #11: Add job storage (in-memory)
**Label:** member-3
**File:** `backend/api/routes.py` or new `backend/api/job_store.py`
- Simple dict-based in-memory job store
- Store analysis results by job_id
- Used by /export/pdf and /export/cbam endpoints

### Issue #12: Wire /export endpoints
**Label:** member-3
**File:** `backend/api/routes.py`
- `/export/pdf/{job_id}` → call `generate_pdf_report()`, return FileResponse
- `/export/cbam/{job_id}` → call `generate_cbam_export()`, return JSON
**Blocked by:** Issues #11, #17, #18

---

## MEMBER 4 — React Frontend

### Issue #13: Build UploadForm.jsx
**Label:** member-4, core
**File:** `frontend/src/components/UploadForm.jsx`
- Drag and drop + click to upload (accept PDF, CSV, TXT)
- Multiple file support
- Show file list with remove option
- Submit button → POST to `/analyze/upload`
- Show loading state during processing

### Issue #14: Build ResultCard.jsx
**Label:** member-4, core
**File:** `frontend/src/components/ResultCard.jsx`
- Display per-product result: description, quantity, CO2e estimate, confidence badge
- Color-code confidence: green >75%, yellow 60-75%, red <60%
- Show min/max as a range string

### Issue #15: Build ConfidenceChart.jsx
**Label:** member-4, core
**File:** `frontend/src/components/ConfidenceChart.jsx`
- Use Recharts BarChart or ComposedChart
- X-axis: product names
- Y-axis: kgCO2e
- Show error bars for min/max range
- Tooltip with full details on hover

### Issue #16: Build ExportPanel.jsx + wire pages
**Label:** member-4
**File:** `frontend/src/components/ExportPanel.jsx`
- Download PDF button → GET `/export/pdf/{job_id}`
- Download CBAM JSON button → GET `/export/cbam/{job_id}`
- Wire Home.jsx (upload form) and Results.jsx (cards + chart + export) pages
- Wire App.jsx routing (Home → Results on success)

---

## MEMBER 5 — PDF Report + CBAM Export + Docs

### Issue #17: Implement pdf_generator.py
**Label:** member-5, core
**File:** `backend/utils/pdf_generator.py`
Scaffold is written. Complete and test:
- Verify table renders correctly with ReportLab
- Add factory logo placeholder area
- Add confidence range visualization (simple text bar)
- Test with sample data — generate an actual PDF and verify it opens

### Issue #18: Implement cbam_export.py
**Label:** member-5, core
**File:** `backend/utils/cbam_export.py`
Scaffold is written. Complete:
- Verify all required CBAM fields are present (ref: docs/CBAM_SCHEMA.md)
- Add `export_to_file()` helper that saves JSON to disk with job_id filename
- Test output matches schema for sample_factory_input.json

### Issue #19: Create realistic sample PDF bill for demo
**Label:** member-5
**File:** `data/sample_inputs/`
- Create a realistic-looking electricity bill PDF (Indian DISCOM format)
- Create a material purchase invoice PDF
- These are used in the demo to show the upload → extraction flow
- Can be created with ReportLab or any PDF tool

### Issue #20: Finalize all docs + README
**Label:** member-5
**Files:** `docs/`, `README.md`
- Review ARCHITECTURE.md, ALGORITHM.md, CBAM_SCHEMA.md, DESIGN.md
- Add setup instructions to README
- Add screenshots section to README (fill after frontend is done)
- Write a 2-paragraph "How it works" plain English explanation for judges

---

## 🔗 Dependency Map

```
#5,#6,#7 (Member 2 — data layer)
    ↓
#1,#2,#3 (Member 1 — engine, depends on data layer)
    ↓
#9,#10,#11 (Member 3 — API, depends on engine)
    ↓
#13,#14,#15,#16 (Member 4 — frontend, depends on API)
#17,#18 (Member 5 — exports, depends on engine)
    ↓
#12 (Member 3 — wire exports, depends on #17,#18)
```

## 🎯 Critical Path for Demo (must work by hour 20)
#5 → #6 → #1 → #3 → #9 → #13 → #15 → demo flow working
