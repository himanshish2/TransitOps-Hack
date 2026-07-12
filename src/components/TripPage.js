import { useState } from "react";

function TripPage() {
  const [trips, setTrips] = useState([]);

  const [form, setForm] = useState({
    source: "",
    destination: "",
    vehicle: "",
    driver: "",
    weight: "",
    distance: "",
    status: "Draft"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addTrip = (e) => {
    e.preventDefault();

    setTrips([...trips, form]);

    // reset form
    setForm({
      source: "",
      destination: "",
      vehicle: "",
      driver: "",
      weight: "",
      distance: "",
      status: "Draft"
    });
  };

  const updateStatus = (index, newStatus) => {
    const updatedTrips = [...trips];
    updatedTrips[index].status = newStatus;
    setTrips(updatedTrips);
  };

  return (
    <div>
      <h2>Trip Management</h2>

      {/* FORM */}
      <form onSubmit={addTrip} className="card form">
        <input
          className="input"
          name="source"
          placeholder="Source"
          value={form.source}
          onChange={handleChange}
        />

        <input
          className="input"
          name="destination"
          placeholder="Destination"
          value={form.destination}
          onChange={handleChange}
        />

        <input
          className="input"
          name="vehicle"
          placeholder="Vehicle"
          value={form.vehicle}
          onChange={handleChange}
        />

        <input
          className="input"
          name="driver"
          placeholder="Driver"
          value={form.driver}
          onChange={handleChange}
        />

        <input
          className="input"
          name="weight"
          placeholder="Cargo Weight"
          value={form.weight}
          onChange={handleChange}
        />

        <input
          className="input"
          name="distance"
          placeholder="Distance"
          value={form.distance}
          onChange={handleChange}
        />

        <button className="button" type="submit">
          Create Trip
        </button>
      </form>

      {/* TRIP LIST */}
      <div>
        {trips.map((trip, index) => (
          <div key={index} className="card">
            <h3>
              {trip.source} → {trip.destination}
            </h3>
            <p>Vehicle: {trip.vehicle}</p>
            <p>Driver: {trip.driver}</p>
            <p>Status: {trip.status}</p>

            {/* Buttons */}
            {trip.status === "Draft" && (
              <button
                className="status-btn dispatch"
                onClick={() => updateStatus(index, "Dispatched")}
              >
                Dispatch
              </button>
            )}

            {trip.status === "Dispatched" && (
              <>
                <button
                  className="status-btn complete"
                  onClick={() => updateStatus(index, "Completed")}
                >
                  Complete
                </button>

                <button
                  className="status-btn cancel"
                  onClick={() => updateStatus(index, "Cancelled")}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TripPage;