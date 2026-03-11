# CBAM Export Schema Reference

## What CBAM Requires (Definitive Phase, 2026)

For each imported good, the declarant must provide:

| Field | Description | Example |
|-------|-------------|---------|
| `hs_code` | 6-digit HS/CN code | `720810` |
| `goods_description` | Product description | `Forged crankshaft blank` |
| `country_of_origin` | ISO 3166-1 alpha-2 | `IN` |
| `net_mass_tonnes` | Net mass of goods imported | `12.5` |
| `embedded_emissions_tco2e` | Total embedded CO₂e (tonnes) | `23.75` |
| `embedded_emissions_intensity` | tCO₂e per tonne of good | `1.9` |
| `emissions_scope` | Direct (Scope 1) or indirect | `direct` |
| `calculation_method` | How emissions were determined | `estimated_disaggregation` |
| `carbon_price_paid` | Carbon price paid in origin country (EUR/tonne) | `0` |
| `confidence_level` | Estimation confidence (%) | `76` |
| `methodology_reference` | Reference to calculation methodology | `CarbonLens v0.1.0 ALGORITHM.md` |

---

## CarbonLens CBAM JSON Output Format

```json
{
  "carbonlens_version": "0.1.0",
  "generated_at": "2026-03-11T10:30:00Z",
  "factory": {
    "name": "Example Forging Unit",
    "country": "IN",
    "cluster": "Rajkot"
  },
  "reporting_period": {
    "from": "2026-02-01",
    "to": "2026-02-28"
  },
  "products": [
    {
      "hs_code": "720810",
      "goods_description": "Forged crankshaft blank - mild steel",
      "country_of_origin": "IN",
      "quantity_units": 1200,
      "unit_weight_kg": 4.2,
      "net_mass_tonnes": 5.04,
      "embedded_emissions": {
        "min_tco2e": 9.1,
        "estimate_tco2e": 10.8,
        "max_tco2e": 14.2,
        "intensity_min": 1.81,
        "intensity_estimate": 2.14,
        "intensity_max": 2.82
      },
      "confidence_level_pct": 78,
      "emissions_scope": "direct",
      "calculation_method": "physics_informed_bayesian_disaggregation",
      "carbon_price_paid_eur_per_tco2e": 0,
      "methodology_reference": "CarbonLens v0.1.0 — docs/ALGORITHM.md"
    }
  ],
  "factory_totals": {
    "total_energy_kwh": 48000,
    "total_material_kg": 42000,
    "grid_emission_factor": 0.716,
    "total_factory_co2e_estimate": 48.3
  }
}
```

---

## Notes for v0.1.0

- CBAM does not yet have a mandatory machine-readable XML schema for Tier 3 data submission — this JSON is designed to map directly to the CBAM declarant portal fields
- The `calculation_method: "physics_informed_bayesian_disaggregation"` value qualifies as an "estimated" method under CBAM Article 4(3) default values provision
- Confidence intervals should be disclosed to the OEM — they can use the midpoint estimate for submission and cite the range in their methodology note
