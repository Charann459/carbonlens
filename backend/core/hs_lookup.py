# HS Code Auto-Suggest
# Fallback keyword matcher when LLM extraction returns empty hs_code
# Covers common Indian MSME forging/casting/stamping parts

_HS_RULES = [
    # (keywords, hs_code, description)
    (["crankshaft", "crank shaft"],                     "8483.10", "Crankshafts and camshafts"),
    (["camshaft", "cam shaft"],                         "8483.10", "Crankshafts and camshafts"),
    (["connecting rod", "con rod", "conrod"],           "8483.10", "Connecting rods"),
    (["suspension arm", "control arm", "wishbone"],     "8708.80", "Suspension systems & parts"),
    (["steering knuckle", "knuckle"],                   "8708.80", "Suspension/steering parts"),
    (["brake bracket", "brake mount", "caliper bracket"],"8708.40","Brakes and parts"),
    (["brake disc", "brake drum", "rotor"],             "8708.40", "Brakes and parts"),
    (["hub", "wheel hub", "hub carrier"],               "8708.50", "Drive axles and parts"),
    (["axle", "drive shaft", "driveshaft"],             "8708.50", "Drive axles and parts"),
    (["gear", "gearbox", "transmission"],               "8708.40", "Gearbox parts"),
    (["differential", "diff housing"],                  "8708.60", "Differential parts"),
    (["flange", "coupling flange"],                     "8483.60", "Clutches and shaft couplings"),
    (["bearing housing", "bearing cap"],                "8483.30", "Bearing housings"),
    (["pulley", "sheave"],                              "8483.50", "Flywheels and pulleys"),
    (["flywheel"],                                      "8483.50", "Flywheels and pulleys"),
    (["valve body", "valve housing"],                   "8481.80", "Taps, cocks, valves"),
    (["pump housing", "pump casing"],                   "8413.91", "Pump parts"),
    (["cylinder head", "engine block"],                 "8409.91", "Engine parts"),
    (["piston", "piston rod"],                          "8409.91", "Engine parts"),
    (["impeller", "turbine wheel"],                     "8406.90", "Turbine parts"),
    (["bracket", "mounting bracket", "support bracket"],"7326.90", "Steel articles"),
    (["flange plate", "steel plate forging"],           "7208.10", "Flat rolled steel products"),
    (["billet", "bloom", "blank"],                      "7207.11", "Semi-finished steel products"),
    (["aluminium casting", "aluminum casting"],         "7616.99", "Aluminium articles"),
    (["iron casting", "cast iron"],                     "7325.10", "Cast iron articles"),
]

def suggest_hs_code(description: str) -> str:
    """
    Returns best-match HS code for a product description.
    Returns empty string if no match found.
    """
    if not description:
        return ""
    desc_lower = description.lower()
    for keywords, hs_code, _ in _HS_RULES:
        if any(kw in desc_lower for kw in keywords):
            return hs_code
    return ""


def suggest_hs_code_with_label(description: str) -> dict:
    """Returns {hs_code, label, source} dict."""
    if not description:
        return {"hs_code": "", "label": "", "source": "none"}
    desc_lower = description.lower()
    for keywords, hs_code, label in _HS_RULES:
        if any(kw in desc_lower for kw in keywords):
            return {"hs_code": hs_code, "label": label, "source": "keyword_match"}
    return {"hs_code": "", "label": "", "source": "none"}