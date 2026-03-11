# Material Attribution Module
# Allocates bulk material purchases to individual product lines
# using yield coefficients per process type

from core.emission_factors.sec_lookup import get_yield_coefficient

def attribute_material(total_material_kg: float, products: list[dict]) -> list[dict]:
    """
    Allocates bulk material to each product line using yield loss coefficients.
    
    Args:
        total_material_kg: Total bulk material purchased
        products: List of product dicts
        
    Returns:
        Products with added fields:
          - yield_coefficient
          - material_input_per_unit_kg (gross input including scrap)
          - material_output_per_unit_kg (net finished weight)
    """
    # Step 1: calculate gross material demand per product
    demands = []
    for product in products:
        yield_coeff = get_yield_coefficient(product["process"], product["material"])
        gross_per_unit = product["unit_weight_kg"] / yield_coeff
        total_gross = gross_per_unit * product["quantity_units"]
        demands.append({
            "product": product,
            "yield_coeff": yield_coeff,
            "gross_per_unit": gross_per_unit,
            "total_gross_demand": total_gross
        })
    
    total_demand = sum(d["total_gross_demand"] for d in demands)
    
    # Step 2: scale to fit actual purchase (constraint)
    scale = total_material_kg / total_demand if total_demand > 0 else 1.0
    
    results = []
    for d in demands:
        adjusted_gross_per_unit = d["gross_per_unit"] * scale
        results.append({
            **d["product"],
            "yield_coefficient": d["yield_coeff"],
            "material_input_per_unit_kg": adjusted_gross_per_unit,
            "material_output_per_unit_kg": d["product"]["unit_weight_kg"],
            "material_scale_factor": scale
        })
    
    return results
