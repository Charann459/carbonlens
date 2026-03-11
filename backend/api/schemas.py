# Request and response schemas for CarbonLens API

from pydantic import BaseModel
from typing import Optional

class ProductInput(BaseModel):
    id: str
    description: str
    hs_code: str
    process: str           # forging | casting | stamping
    material: str          # mild_steel | alloy_steel | aluminium | etc.
    quantity_units: int
    unit_weight_kg: float
    customer: Optional[str] = None

class FactoryInput(BaseModel):
    name: str
    location: str
    grid_zone: Optional[str] = "IN_NATIONAL"

class EnergyInput(BaseModel):
    total_kwh: float

class MaterialInput(BaseModel):
    type: str
    quantity_kg: float
    assumed_scrap_based: bool = True

class AnalyzeRequest(BaseModel):
    factory: FactoryInput
    reporting_period: dict
    energy: EnergyInput
    materials: list[MaterialInput]
    products: list[ProductInput]

class ProductEmissions(BaseModel):
    product_id: str
    description: str
    hs_code: str
    country_of_origin: str = "IN"
    quantity_units: int
    unit_weight_kg: float
    net_mass_tonnes: float
    co2e_min: float
    co2e_estimate: float
    co2e_max: float
    intensity_min: float       # tCO2e per tonne
    intensity_estimate: float
    intensity_max: float
    confidence_pct: float
    methodology: str

class AnalyzeResponse(BaseModel):
    job_id: str
    products: list[ProductEmissions]
    factory_total_co2e: float
    warnings: list[str]
