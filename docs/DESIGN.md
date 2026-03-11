# CarbonLens — Design Decisions & Assumptions

## Core Design Principles

### 1. Never demand data that doesn't exist
Traditional carbon tools fail at Tier 3 because they assume sub-metered, per-product energy records. CarbonLens is designed around what a small manufacturer *always* has: one energy bill, one material receipt, one production count.

### 2. LLM for understanding, not calculation
Claude API is used solely to extract structured data from unstructured documents. All emission calculations are deterministic Python. This prevents hallucinated carbon numbers.

### 3. Honest uncertainty over fake precision
Outputs are ranges with confidence levels, not point estimates. A range of 3.8–5.1 kgCO₂e with 78% confidence is more defensible to a CBAM auditor than a fabricated 4.2 kgCO₂e.

### 4. Physics grounds the AI
BEE-published SEC benchmarks are the anchor. The Bayesian model adjusts around these physically validated priors — it cannot produce results that violate energy conservation laws.

---

## Assumptions in v0.1.0

| Assumption | Justification | Risk |
|------------|---------------|------|
| Grid emission factor = India CEA 2023 average | Best available public data | Regional variation ignored |
| Steel assumed scrap-based for SMEs | Most Rajkot units use secondary steel | May overstate for primary steel users |
| Yield coefficients from BEE cluster reports | Validated for Indian forging/casting clusters | May vary by machine age |
| SEC uncertainty = ±15% of benchmark | Conservative estimate from BEE variance data | Could be wider for older equipment |
| All products processed on same shift schedule | Simplification for v0.1.0 | Shift-split factories would need v0.2.0 logic |

---

## What v0.1.0 Does NOT Cover

- Multi-shift attribution (products made on different shifts)
- Scope 2 (purchased heat/steam) beyond electricity
- Transport emissions (Scope 3 downstream)
- Real-time sub-meter integration
- Multi-factory / multi-site organizations
- Non-Indian grid factors (extendable via factor_db.py)

---

## LLM Extraction Design

The LLM parser is given a structured prompt asking it to extract:
- Total kWh from electricity bill
- Material line items (type, quantity, unit)
- Machine list if present
- Product quantities and descriptions

The prompt explicitly instructs the model to return `null` for fields it cannot find rather than guessing. Extracted values are validated against Pydantic schemas before entering the disaggregation engine.

---

## Future Roadmap

### v0.2.0
- ML-based SEC predictor (trained on contributed factory data)
- Multi-language document support (Hindi, Chinese, German invoices)
- SAP/ERP connector

### v0.3.0
- Federated learning across factory network
- Reduction scenario simulator ("what if you switched to scrap steel?")
- Direct CBAM portal API submission
