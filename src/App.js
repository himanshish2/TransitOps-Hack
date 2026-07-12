import { useState } from "react";
import "./App.css";
import TripPage from "./components/TripPage";
import MaintenancePage from "./components/MaintenancePage";
import ExpensePage from "./components/ExpensePage";

function App() {
  const [page, setPage] = useState("trips");

  return (
    <div className="container">
      <h1 className="title">TransitOps Dashboard</h1>

      {/* NAVBAR */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setPage("trips")} className="button">
          Trips
        </button>
        <button onClick={() => setPage("maintenance")} className="button">
          Maintenance
        </button>
        <button onClick={() => setPage("expenses")} className="button">
          Expenses
        </button>
      </div>

      {/* PAGE CONTENT */}
      {page === "trips" && <TripPage />}
      {page === "maintenance" && <MaintenancePage />}
      {page === "expenses" && <ExpensePage />}
    </div>
  );
}

export default App;