# SEC Benchmark Lookup
# Returns Specific Energy Consumption benchmarks from BEE/IPCC data

import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), "../../../../data/sec_benchmarks")

_cache = {}

def _load(process: str) -> dict:
    if process not in _cache:
        path = os.path.join(DATA_DIR, f"{process}.json")
        with open(path) as f:
            _cache[process] = json.load(f)
    return _cache[process]

def get_sec_benchmark(process: str, material: str) -> dict:
    """
    Returns SEC benchmark dict: {min, typical, max} in kWh/tonne
    
    Args:
        process: forging | casting | stamping
        material: mild_steel | alloy_steel | aluminium | grey_iron | etc.
    """
    try:
        data = _load(process)
        benchmarks = data.get("benchmarks", {})
        
        if material in benchmarks:
            return benchmarks[material]
        
        # Fuzzy fallback
        for key in benchmarks:
            if material.split("_")[0] in key:
                return benchmarks[key]
        
        # Default fallback
        return {"min": 400, "typical": 700, "max": 1000}
    
    except FileNotFoundError:
        return {"min": 400, "typical": 700, "max": 1000}


def get_yield_coefficient(process: str, material: str) -> float:
    """
    Returns yield coefficient (finished weight / input weight) for the process.
    """
    try:
        data = _load(process)
        benchmarks = data.get("benchmarks", {})
        
        if material in benchmarks:
            return benchmarks[material].get("yield_coefficient", 0.80)
        
        for key in benchmarks:
            if material.split("_")[0] in key:
                return benchmarks[key].get("yield_coefficient", 0.80)
    
    except FileNotFoundError:
        pass
    
    return 0.80  # Default 80% yield
