# CBAM Export Utility
# Generates CBAM-compatible JSON from analysis results
# See docs/CBAM_SCHEMA.md for field descriptions

import json
from datetime import datetime

def generate_cbam_export(
    factory: dict,
    reporting_period: dict,
    products: list[dict],
    factory_totals: dict
) -> dict:
    """
    Generates CBAM-formatted JSON export.
    
    Returns dict matching schema in docs/CBAM_SCHEMA.md
    """
    return {
        "carbonlens_version": "0.1.0",
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "factory": {
            "name": factory.get("name"),
            "country": factory.get("country", "IN"),
            "cluster": factory.get("location", "")
        },
        "reporting_period": reporting_period,
        "products": [
            {
                "hs_code": p.get("hs_code", ""),
                "goods_description": p.get("description", ""),
                "country_of_origin": p.get("country_of_origin", "IN"),
                "quantity_units": p.get("quantity_units"),
                "unit_weight_kg": p.get("unit_weight_kg"),
                "net_mass_tonnes": p.get("net_mass_tonnes"),
                "embedded_emissions": {
                    "min_tco2e": round(p.get("co2e_min", 0) / 1000, 4),
                    "estimate_tco2e": round(p.get("co2e_estimate", 0) / 1000, 4),
                    "max_tco2e": round(p.get("co2e_max", 0) / 1000, 4),
                    "intensity_min": p.get("intensity_min"),
                    "intensity_estimate": p.get("intensity_estimate"),
                    "intensity_max": p.get("intensity_max")
                },
                "confidence_level_pct": p.get("confidence_pct"),
                "emissions_scope": "direct",
                "calculation_method": p.get("methodology"),
                "carbon_price_paid_eur_per_tco2e": 0,
                "methodology_reference": "CarbonLens v0.1.0 — docs/ALGORITHM.md"
            }
            for p in products
        ],
        "factory_totals": factory_totals
    }


def export_to_json_string(cbam_data: dict) -> str:
    return json.dumps(cbam_data, indent=2)
