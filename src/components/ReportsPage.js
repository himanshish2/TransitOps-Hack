function ReportsPage({ trips = [], expenses = [], maintenance = [] }) {

  // 🔹 Total Distance
  const totalDistance = trips.reduce((sum, t) => {
    return sum + Number(t.distance || 0);
  }, 0);

  // 🔹 Total Fuel
  const totalFuel = expenses.reduce((sum, e) => {
    return sum + Number(e.liters || 0);
  }, 0);

  // 🔹 Total Fuel Cost
  const fuelCost = expenses.reduce((sum, e) => {
    return sum + Number(e.cost || 0);
  }, 0);

  // 🔹 Maintenance Cost (dummy: ₹1000 per record)
  const maintenanceCost = maintenance.length * 1000;

  // 🔹 Fuel Efficiency
  const fuelEfficiency =
    totalFuel > 0 ? (totalDistance / totalFuel).toFixed(2) : 0;

  // 🔹 Fleet Utilization
  const activeTrips = trips.filter(t => t.status === "Dispatched").length;
  const fleetUtilization =
    trips.length > 0 ? ((activeTrips / trips.length) * 100).toFixed(2) : 0;

  // 🔹 Operational Cost
  const operationalCost = fuelCost + maintenanceCost;

  // 🔹 Dummy Revenue (₹50 per km)
  const revenue = totalDistance * 50;

  // 🔹 Dummy Acquisition Cost
  const acquisitionCost = 500000;

  // 🔹 ROI
  const roi =
    acquisitionCost > 0
      ? ((revenue - operationalCost) / acquisitionCost).toFixed(2)
      : 0;

  return (
    <div>
      <h2>Reports & Analytics</h2>

      <div className="card">
        <h3>Total Distance: {totalDistance} km</h3>
        <h3>Total Fuel: {totalFuel} L</h3>
        <h3>Fuel Efficiency: {fuelEfficiency} km/L</h3>
        <h3>Fleet Utilization: {fleetUtilization}%</h3>
        <h3>Operational Cost: ₹{operationalCost}</h3>
        <h3>Vehicle ROI: {roi}</h3>
      </div>
    </div>
  );
}

export default ReportsPage;