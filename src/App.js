import { useState } from "react";
import "./App.css";
import TripPage from "./components/TripPage";
import MaintenancePage from "./components/MaintenancePage";
import ExpensePage from "./components/ExpensePage";
import ReportsPage from "./components/ReportsPage";

function App() {
  const [page, setPage] = useState("trips");

  const [trips, setTrips] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [maintenance, setMaintenance] = useState([]);

  return (
    <div className="container">
      <h1 className="title">TransitOps Dashboard</h1>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setPage("trips")} className="button">Trips</button>
        <button onClick={() => setPage("maintenance")} className="button">Maintenance</button>
        <button onClick={() => setPage("expenses")} className="button">Expenses</button>
        <button onClick={() => setPage("reports")} className="button">Reports</button>
      </div>

      {page === "trips" && <TripPage trips={trips} setTrips={setTrips} />}
      {page === "maintenance" && <MaintenancePage maintenance={maintenance} setMaintenance={setMaintenance} />}
      {page === "expenses" && <ExpensePage expenses={expenses} setExpenses={setExpenses} />}
      {page === "reports" && (
        <ReportsPage
          trips={trips}
          expenses={expenses}
          maintenance={maintenance}
        />
      )}
    </div>
  );
}

export default App;