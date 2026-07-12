import { useState } from "react";

function MaintenancePage() {
  const [records, setRecords] = useState([]);

  const [form, setForm] = useState({
    vehicle: "",
    issue: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addRecord = (e) => {
    e.preventDefault();

    setRecords([...records, { ...form, status: "In Shop" }]);

    setForm({
      vehicle: "",
      issue: ""
    });
  };

  return (
    <div>
      <h2>Maintenance Management</h2>

      {/* FORM */}
      <form onSubmit={addRecord} className="card form">
        <input
          className="input"
          name="vehicle"
          placeholder="Vehicle"
          value={form.vehicle}
          onChange={handleChange}
        />

        <input
          className="input"
          name="issue"
          placeholder="Issue (e.g., Oil Change)"
          value={form.issue}
          onChange={handleChange}
        />

        <button className="button" type="submit">
          Add Maintenance
        </button>
      </form>

      {/* LIST */}
      <div>
        {records.map((rec, index) => (
          <div key={index} className="card">
            <h3>{rec.vehicle}</h3>
            <p>Issue: {rec.issue}</p>
            <p>Status: {rec.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MaintenancePage;