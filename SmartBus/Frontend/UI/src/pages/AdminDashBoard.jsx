import { useState } from "react";
import { Map, Bus, CalendarClock, PlusCircle } from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("buses");

  // --- Form States ---
  const [busData, setBusData] = useState({
    registrationNo: "",
    totalSeats: "",
    busType: "AC",
  });
  const [routeData, setRouteData] = useState({
    origin: "",
    destination: "",
    distanceKm: "",
  });
  const [tripData, setTripData] = useState({
    busId: "",
    routeId: "",
    departureTime: "",
    arrivalTime: "",
    fare: "",
  });

  const handleBusSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Bus:", busData);
    alert("Bus created successfully!");
    setBusData({ registrationNo: "", totalSeats: "", busType: "AC" });
  };

  const handleRouteSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Route:", routeData);
    alert("Route created successfully!");
    setRouteData({ origin: "", destination: "", distanceKm: "" });
  };

  const handleTripSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Trip:", tripData);
    alert("Trip scheduled successfully!");
    setTripData({
      busId: "",
      routeId: "",
      departureTime: "",
      arrivalTime: "",
      fare: "",
    });
  };

  return (
    <div className="page-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 style={{ padding: '0 1rem', marginBottom: '1rem', marginTop: 0 }}>Operator Panel</h2>

        <button
          onClick={() => setActiveTab("buses")}
          className={`tab-btn ${activeTab === "buses" ? "active" : ""}`}
        >
          <Bus size={20} /> Manage Buses
        </button>

        <button
          onClick={() => setActiveTab("routes")}
          className={`tab-btn ${activeTab === "routes" ? "active" : ""}`}
        >
          <Map size={20} /> Manage Routes
        </button>

        <button
          onClick={() => setActiveTab("trips")}
          className={`tab-btn ${activeTab === "trips" ? "active" : ""}`}
        >
          <CalendarClock size={20} /> Schedule Trips
        </button>
      </div>

      {/* Main Content */}
      <div className="main-card">
        {/* BUS TAB */}
        {activeTab === "buses" && (
          <div>
            <h3 className="section-title">
              <Bus color="var(--accent-blue)" /> Register New Bus
            </h3>
            <form onSubmit={handleBusSubmit}>
              <div className="form-group" style={{ maxWidth: '400px' }}>
                <label>Registration Number</label>
                <input
                  required
                  type="text"
                  placeholder="GJ-01-AB-1234"
                  value={busData.registrationNo}
                  onChange={(e) => setBusData({ ...busData, registrationNo: e.target.value })}
                />
              </div>
              <div className="form-grid" style={{ maxWidth: '400px' }}>
                <div className="form-group">
                  <label>Total Seats</label>
                  <input
                    required
                    type="number"
                    placeholder="40"
                    value={busData.totalSeats}
                    onChange={(e) => setBusData({ ...busData, totalSeats: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Bus Type</label>
                  <select
                    value={busData.busType}
                    onChange={(e) => setBusData({ ...busData, busType: e.target.value })}
                  >
                    <option value="AC">AC</option>
                    <option value="NON_AC">Non-AC</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="primary-btn" style={{ maxWidth: '400px' }}>
                <PlusCircle size={20} /> Save Bus
              </button>
            </form>
          </div>
        )}

        {/* ROUTE TAB */}
        {activeTab === "routes" && (
          <div>
            <h3 className="section-title">
              <Map color="var(--accent-orange)" /> Create New Route
            </h3>
            <form onSubmit={handleRouteSubmit} style={{ maxWidth: '400px' }}>
              <div className="form-group">
                <label>Origin City</label>
                <input
                  required
                  type="text"
                  placeholder="e.g., Ahmedabad"
                  value={routeData.origin}
                  onChange={(e) => setRouteData({ ...routeData, origin: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Destination City</label>
                <input
                  required
                  type="text"
                  placeholder="e.g., Surat"
                  value={routeData.destination}
                  onChange={(e) => setRouteData({ ...routeData, destination: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Distance (Km)</label>
                <input
                  type="number"
                  placeholder="265"
                  value={routeData.distanceKm}
                  onChange={(e) => setRouteData({ ...routeData, distanceKm: e.target.value })}
                />
              </div>
              <button type="submit" className="primary-btn">
                <PlusCircle size={20} /> Save Route
              </button>
            </form>
          </div>
        )}

        {/* TRIP TAB */}
        {activeTab === "trips" && (
          <div>
            <h3 className="section-title">
              <CalendarClock color="var(--accent-pink)" /> Schedule a Trip
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              In a full production environment, the Bus ID and Route ID would be searchable dropdowns.
            </p>
            <form onSubmit={handleTripSubmit} style={{ maxWidth: '400px' }}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Bus ID</label>
                  <input
                    required
                    type="number"
                    value={tripData.busId}
                    onChange={(e) => setTripData({ ...tripData, busId: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Route ID</label>
                  <input
                    required
                    type="number"
                    value={tripData.routeId}
                    onChange={(e) => setTripData({ ...tripData, routeId: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Departure Time</label>
                <input
                  required
                  type="datetime-local"
                  value={tripData.departureTime}
                  onChange={(e) => setTripData({ ...tripData, departureTime: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Arrival Time</label>
                <input
                  required
                  type="datetime-local"
                  value={tripData.arrivalTime}
                  onChange={(e) => setTripData({ ...tripData, arrivalTime: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Ticket Fare (₹)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={tripData.fare}
                  onChange={(e) => setTripData({ ...tripData, fare: e.target.value })}
                />
              </div>
              <button type="submit" className="primary-btn">
                <PlusCircle size={20} /> Schedule Trip
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
