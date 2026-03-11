// Temporary mock data for testing your UI
const mockProducts = [
  {
    product_id: "P001",
    description: "Crankshaft blank",
    hs_code: "720810",
    quantity_units: 1200,
    co2e_min: 9100.5,
    co2e_estimate: 10800.2,
    co2e_max: 14200.0,
    confidence_pct: 78, // Should be Green
    methodology: "physics_informed_bayesian_disaggregation"
  },
  {
    product_id: "P002",
    description: "Suspension arm",
    hs_code: "870880",
    quantity_units: 800,
    co2e_min: 5200.0,
    co2e_estimate: 6100.5,
    co2e_max: 7800.0,
    confidence_pct: 65, // Should be Yellow
    methodology: "physics_informed_bayesian_disaggregation"
  },
  {
    product_id: "P003",
    description: "Brake bracket (Missing Data)",
    hs_code: "870840",
    quantity_units: 2100,
    co2e_min: 12000.0,
    co2e_estimate: 15500.0,
    co2e_max: 22000.0,
    confidence_pct: 45, // Should be Red
    methodology: "physics_informed_bayesian_disaggregation"
  }
];

// Inside your render:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {mockProducts.map(p => <ResultCard key={p.product_id} product={p} />)}
</div>