# CarbonLens — Disaggregation Algorithm

## Problem Statement

Given:
- `E_total` — total factory electricity consumption (kWh/month)
- `M_total` — total bulk material purchased (kg)
- `P = {p1, p2, ..., pn}` — products manufactured with quantities `Q = {q1, q2, ..., qn}`
- `Process type` per product (forging / casting / stamping)
- `Material grade` per product (mild steel / alloy steel / aluminium / etc.)

Find:
- `e_i` — energy consumed per unit of product `pi` (kWh/unit)
- `m_i` — material consumed per unit of product `pi` (kg/unit)
- `CO2e_i` — carbon footprint per unit of product `pi` (kgCO2e/unit) with confidence interval

---

## Step 1 — SEC Benchmark Lookup

For each product `pi`, retrieve Specific Energy Consumption benchmark:

```
SEC_i = lookup(process_type_i, material_grade_i)  [kWh/tonne]
```

Source: BEE India SME cluster benchmarks
- Forging (mild steel): 600–900 kWh/tonne
- Forging (alloy steel): 800–1100 kWh/tonne
- Die casting (aluminium): 400–700 kWh/tonne
- Sand casting (iron): 500–800 kWh/tonne
- Cold stamping: 50–150 kWh/tonne

---

## Step 2 — Energy Attribution

Calculate relative energy weight for each product:

```
w_i = SEC_i × Q_i × unit_weight_i   [relative energy demand]

e_i_raw = E_total × (w_i / Σw_j)    [kWh allocated to product i total]

e_i_unit = e_i_raw / Q_i             [kWh per unit]
```

---

## Step 3 — Material Attribution

Use yield loss coefficients per process:

```
yield_i = lookup_yield(process_type_i, material_grade_i)
# e.g., forging yield = 0.85 (15% scrap loss)

m_i_unit = unit_weight_i / yield_i   [kg input material per unit]
```

Constrain to factory total:
```
Scale factor = M_total / Σ(m_i_unit × Q_i)
m_i_unit_adjusted = m_i_unit × scale_factor
```

---

## Step 4 — Bayesian Fusion + Confidence

Treat SEC values as distributions (not point estimates):

```
SEC_i ~ Normal(μ=SEC_benchmark, σ=SEC_benchmark×0.15)
```

Run Monte Carlo (N=1000 samples):
- For each sample, draw SEC values from distributions
- Compute allocation
- Record CO2e per unit

Output:
```
CO2e_i = [P5, P50, P95] of sampled distribution
confidence = f(σ_SEC, data_completeness, yield_certainty)
```

---

## Step 5 — Emission Factor Application

```
CO2e_energy_i = e_i_unit × EF_grid          [kgCO2e, grid emission factor]
CO2e_material_i = m_i_unit × EF_material_i  [kgCO2e, material emission factor]

CO2e_total_i = CO2e_energy_i + CO2e_material_i
```

Emission factors (defaults):
- India grid: 0.716 kgCO2e/kWh (CEA 2023)
- Steel (primary): 1.85 kgCO2e/kg
- Steel (scrap-based): 0.43 kgCO2e/kg
- Aluminium (primary): 8.24 kgCO2e/kg

---

## Constraints

1. `Σ(e_i_unit × Q_i) = E_total` (energy conservation)
2. `Σ(m_i_unit × Q_i) ≤ M_total` (material conservation)
3. All `CO2e_i > 0`
4. Confidence > 60% required for valid output (else flag as low-confidence)

---

## Future: ML SEC Predictor (v0.2.0)

Replace static SEC lookup with a trained regression model:
- Features: process_type, material_grade, machine_age, batch_size, cycle_time
- Target: actual SEC (kWh/tonne)
- Training data: factory-contributed actuals (federated, anonymized)
- Until sufficient data: fall back to BEE benchmark priors
