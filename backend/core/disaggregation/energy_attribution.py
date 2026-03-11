# Energy Attribution Module
# Allocates factory-level total kWh to individual product lines
# using SEC benchmarks weighted by production volume

from core.emission_factors.sec_lookup import get_sec_benchmark

def attribute_energy(total_kwh: float, products: list[dict]) -> list[dict]:
    """
    Allocates total factory energy to each product line.
    
    Args:
        total_kwh: Total factory electricity consumption
        products: List of product dicts with process, material, quantity, unit_weight_kg
        
    Returns:
        List of products with added fields:
          - sec_benchmark (kWh/tonne)
          - allocated_kwh_total
          - allocated_kwh_per_unit
    """
    # Step 1: compute energy weight for each product
    weights = []
    for product in products:
        sec = get_sec_benchmark(product["process"], product["material"])
        tonnes = (product["quantity_units"] * product["unit_weight_kg"]) / 1000
        weight = sec["typical"] * tonnes
        weights.append({
            "product": product,
            "sec": sec,
            "tonnes": tonnes,
            "weight": weight
        })
    
    total_weight = sum(w["weight"] for w in weights)
    
    # Step 2: allocate proportionally
    results = []
    for w in weights:
        share = w["weight"] / total_weight if total_weight > 0 else 0
        allocated_total = total_kwh * share
        allocated_per_unit = allocated_total / w["product"]["quantity_units"]
        
        results.append({
            **w["product"],
            "sec_benchmark": w["sec"],
            "energy_share": share,
            "allocated_kwh_total": allocated_total,
            "allocated_kwh_per_unit": allocated_per_unit
        })
    
    return results
