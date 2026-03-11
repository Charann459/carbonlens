# Emission Factor Database
# Grid and material emission factors from BEE, CEA, IPCC

GRID_EMISSION_FACTORS = {
    "IN_NATIONAL": 0.716,    # India national average, CEA 2023 (kgCO2e/kWh)
    "IN_WESTERN": 0.820,     # Western grid (Gujarat, Maharashtra)
    "IN_NORTHERN": 0.680,
    "IN_SOUTHERN": 0.650,
    "CN_NATIONAL": 0.581,    # China national average
    "EU_AVERAGE": 0.276,
    "DE": 0.380,             # Germany
    "DEFAULT": 0.716
}

MATERIAL_EMISSION_FACTORS = {
    # kgCO2e per kg of material
    "mild_steel": {
        "primary": 1.85,
        "scrap": 0.43
    },
    "alloy_steel": {
        "primary": 2.20,
        "scrap": 0.55
    },
    "stainless_steel": {
        "primary": 6.15,
        "scrap": 2.90
    },
    "aluminium": {
        "primary": 8.24,
        "scrap": 0.60
    },
    "grey_iron": {
        "primary": 1.51,
        "scrap": 0.43
    },
    "brass": {
        "primary": 3.20,
        "scrap": 1.40
    },
    "default": {
        "primary": 2.00,
        "scrap": 0.50
    }
}

def get_grid_emission_factor(grid_zone: str = "IN_NATIONAL") -> float:
    return GRID_EMISSION_FACTORS.get(grid_zone, GRID_EMISSION_FACTORS["DEFAULT"])

def get_material_emission_factor(material: str, scrap_based: bool = True) -> float:
    mat = MATERIAL_EMISSION_FACTORS.get(material, MATERIAL_EMISSION_FACTORS["default"])
    return mat["scrap"] if scrap_based else mat["primary"]
