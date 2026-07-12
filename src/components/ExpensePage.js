import { useState } from "react";

function ExpensePage() {
  const [logs, setLogs] = useState([]);

  const [form, setForm] = useState({
    vehicle: "",
    liters: "",
    cost: "",
    date: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addLog = (e) => {
    e.preventDefault();

    setLogs([...logs, form]);

    setForm({
      vehicle: "",
      liters: "",
      cost: "",
      date: ""
    });
  };

  const totalCost = logs.reduce((sum, log) => {
    return sum + Number(log.cost);
  }, 0);

  return (
    <div>
      <h2>Fuel & Expense Management</h2>

      {/* FORM */}
      <form onSubmit={addLog} className="card form">
        <input
          className="input"
          name="vehicle"
          placeholder="Vehicle"
          value={form.vehicle}
          onChange={handleChange}
        />

        <input
          className="input"
          name="liters"
          placeholder="Fuel (Liters)"
          value={form.liters}
          onChange={handleChange}
        />

        <input
          className="input"
          name="cost"
          placeholder="Cost"
          value={form.cost}
          onChange={handleChange}
        />

        <input
          className="input"
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />

        <button className="button" type="submit">
          Add Log
        </button>
      </form>

      {/* TOTAL */}
      <div className="card">
        <h3>Total Expense: ₹{totalCost}</h3>
      </div>

      {/* LIST */}
      <div>
        {logs.map((log, index) => (
          <div key={index} className="card">
            <h3>{log.vehicle}</h3>
            <p>Fuel: {log.liters} L</p>
            <p>Cost: ₹{log.cost}</p>
            <p>Date: {log.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpensePage;