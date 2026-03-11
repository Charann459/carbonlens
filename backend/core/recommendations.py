# Reduction Recommendations Engine
# Compares current emissions against alternatives and surfaces actionable insights

GRID_EF_CURRENT   = 0.716   # India national grid kgCO2e/kWh
GRID_EF_SOLAR     = 0.045   # Rooftop solar kgCO2e/kWh
GRID_EF_RENEWABLE = 0.082   # Green tariff / RE certificate

MAT_EF_SCRAP      = 0.43    # Scrap-based mild steel (current default)
MAT_EF_PRIMARY    = 1.85    # Primary mild steel
MAT_EF_DRI        = 0.89    # DRI (direct reduced iron) route

YIELD_FORGING     = 0.85    # Current assumed yield
YIELD_IMPROVED    = 0.90    # With die optimisation / precision forging


def generate_recommendations(products: list[dict], total_kwh: float) -> list[dict]:
    """
    Returns a list of recommendation dicts, sorted by CO2e saving potential (descending).
    Each dict has: type, title, description, saving_kg_co2e, saving_pct, applies_to
    """
    recs = []
    total_co2e = sum(p.get("co2e_estimate", 0) for p in products)
    if total_co2e == 0:
        return []

    # ── REC 1: Solar switch ───────────────────────────────────────────────────
    # Energy share is ~60% of total co2e (scope 2)
    scope2_total = total_co2e * 0.60
    solar_saving = scope2_total * (1 - GRID_EF_SOLAR / GRID_EF_CURRENT)
    recs.append({
        "type": "grid",
        "icon": "☀️",
        "title": "Switch to rooftop solar",
        "description": (
            f"Replacing grid electricity with rooftop solar (EF: {GRID_EF_SOLAR} kgCO₂e/kWh) "
            f"would reduce Scope 2 emissions by ~94%. "
            f"At {total_kwh:,.0f} kWh/month, a ~{int(total_kwh/120)}–{int(total_kwh/100)} kW system is needed."
        ),
        "saving_kg_co2e": round(solar_saving, 1),
        "saving_pct": round(solar_saving / total_co2e * 100, 1),
        "applies_to": "All products",
        "effort": "High",
        "timeframe": "6–18 months"
    })

    # ── REC 2: Green tariff (easier than solar) ───────────────────────────────
    green_saving = scope2_total * (1 - GRID_EF_RENEWABLE / GRID_EF_CURRENT)
    recs.append({
        "type": "grid",
        "icon": "⚡",
        "title": "Switch to renewable energy tariff",
        "description": (
            f"Purchasing Renewable Energy Certificates (RECs) or switching to a green tariff "
            f"(EF: {GRID_EF_RENEWABLE} kgCO₂e/kWh) reduces Scope 2 by ~89% with no capex. "
            f"Available via GUVNL/SECI green tariff programmes."
        ),
        "saving_kg_co2e": round(green_saving, 1),
        "saving_pct": round(green_saving / total_co2e * 100, 1),
        "applies_to": "All products",
        "effort": "Low",
        "timeframe": "1–3 months"
    })

    # ── REC 3: Scrap steel vs primary ─────────────────────────────────────────
    # If already using scrap (default), show what primary would cost
    # Show DRI as upgrade path
    scope1_total = total_co2e * 0.40
    # Current: scrap. DRI would be 0.89/0.43 = 2.07x worse — skip
    # Instead: if they upgraded from primary to scrap
    primary_equivalent = scope1_total * (MAT_EF_PRIMARY / MAT_EF_SCRAP)
    scrap_saving = primary_equivalent - scope1_total
    recs.append({
        "type": "material",
        "icon": "♻️",
        "title": "Maintain scrap-based steel sourcing",
        "description": (
            f"Current estimates assume scrap-based mild steel (EF: {MAT_EF_SCRAP} kgCO₂e/kg). "
            f"Switching to primary steel would increase Scope 1 emissions by "
            f"~{round(scrap_saving/1000, 2)} tCO₂e/month (+{round(scrap_saving/total_co2e*100, 0):.0f}%). "
            f"Verify with supplier that IS2062 billets are secondary route."
        ),
        "saving_kg_co2e": round(scrap_saving, 1),
        "saving_pct": round(scrap_saving / total_co2e * 100, 1),
        "applies_to": "All products",
        "effort": "None",
        "timeframe": "Immediate — verify sourcing",
        "type_tag": "maintain"
    })

    # ── REC 4: Yield improvement ──────────────────────────────────────────────
    total_mat_input = sum(
        p.get("quantity_units", 1) * p.get("unit_weight_kg", 2) / YIELD_FORGING
        for p in products
    )
    mat_saved_kg = total_mat_input * (1 - YIELD_FORGING / YIELD_IMPROVED)
    yield_co2e_saving = mat_saved_kg * MAT_EF_SCRAP
    recs.append({
        "type": "process",
        "icon": "🔧",
        "title": "Improve forging yield from 85% → 90%",
        "description": (
            f"Precision die design and billet sizing optimisation can improve yield from "
            f"85% to ~90%, reducing material input by ~{mat_saved_kg:,.0f} kg/month. "
            f"This saves {round(yield_co2e_saving, 1)} kg CO₂e and reduces material cost."
        ),
        "saving_kg_co2e": round(yield_co2e_saving, 1),
        "saving_pct": round(yield_co2e_saving / total_co2e * 100, 1),
        "applies_to": "All forging lines",
        "effort": "Medium",
        "timeframe": "3–6 months"
    })

    # ── REC 5: Hotspot product targeting ──────────────────────────────────────
    hotspot = max(products, key=lambda p: p.get("intensity_estimate", 0))
    hotspot_intensity = hotspot.get("intensity_estimate", 0)
    avg_intensity = sum(p.get("intensity_estimate", 0) for p in products) / len(products)
    if hotspot_intensity > avg_intensity * 1.1:
        excess_pct = round((hotspot_intensity - avg_intensity) / avg_intensity * 100, 1)
        recs.append({
            "type": "audit",
            "icon": "🎯",
            "title": f"Priority SEC audit: {hotspot.get('description', 'top product')[:30]}",
            "description": (
                f"This product has the highest emission intensity at "
                f"{hotspot_intensity:.3f} tCO₂e/tonne — {excess_pct}% above factory average "
                f"({avg_intensity:.3f} tCO₂e/tonne). A targeted energy audit on its forging "
                f"line could identify inefficiencies in furnace scheduling or die heat loss."
            ),
            "saving_kg_co2e": round(hotspot.get("co2e_estimate", 0) * 0.08, 1),
            "saving_pct": round(hotspot.get("co2e_estimate", 0) * 0.08 / total_co2e * 100, 1),
            "applies_to": hotspot.get("description", "")[:40],
            "effort": "Low",
            "timeframe": "1–2 months"
        })

    # Sort by saving potential, put "maintain" type last
    recs.sort(key=lambda r: (r.get("type_tag") == "maintain", -r["saving_kg_co2e"]))
    return recs