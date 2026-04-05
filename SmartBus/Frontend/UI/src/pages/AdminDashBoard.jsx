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

  // --- Submit Handlers ---
  // In a real app, these would make Axios POST requests to your new secure backend APIs
  const handleBusSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Bus:", busData);
    // await axios.post('/api/admin/buses', busData, { withCredentials: true })
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
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* --- Sidebar Navigation --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2 h-fit">
        <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">
          Operator Panel
        </h2>

        <button
          onClick={() => setActiveTab("buses")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === "buses" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}
        >
          <Bus className="w-5 h-5" /> Manage Buses
        </button>

        <button
          onClick={() => setActiveTab("routes")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === "routes" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}
        >
          <Map className="w-5 h-5" /> Manage Routes
        </button>

        <button
          onClick={() => setActiveTab("trips")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === "trips" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}
        >
          <CalendarClock className="w-5 h-5" /> Schedule Trips
        </button>
      </div>

      {/* --- Main Content Area --- */}
      <div className="md:col-span-3 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
        {/* BUS TAB */}
        {activeTab === "buses" && (
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Bus className="text-blue-600" /> Register New Bus
            </h3>
            <form onSubmit={handleBusSubmit} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Number
                </label>
                <input
                  required
                  type="text"
                  placeholder="GJ-01-AB-1234"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                  value={busData.registrationNo}
                  onChange={(e) =>
                    setBusData({ ...busData, registrationNo: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Seats
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="40"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                    value={busData.totalSeats}
                    onChange={(e) =>
                      setBusData({ ...busData, totalSeats: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bus Type
                  </label>
                  <select
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                    value={busData.busType}
                    onChange={(e) =>
                      setBusData({ ...busData, busType: e.target.value })
                    }
                  >
                    <option value="AC">AC</option>
                    <option value="NON_AC">Non-AC</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 flex justify-center items-center gap-2"
              >
                <PlusCircle className="w-5 h-5" /> Save Bus
              </button>
            </form>
          </div>
        )}

        {/* ROUTE TAB */}
        {activeTab === "routes" && (
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Map className="text-blue-600" /> Create New Route
            </h3>
            <form onSubmit={handleRouteSubmit} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Origin City
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g., Ahmedabad"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                  value={routeData.origin}
                  onChange={(e) =>
                    setRouteData({ ...routeData, origin: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination City
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g., Surat"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                  value={routeData.destination}
                  onChange={(e) =>
                    setRouteData({ ...routeData, destination: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distance (Km)
                </label>
                <input
                  type="number"
                  placeholder="265"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                  value={routeData.distanceKm}
                  onChange={(e) =>
                    setRouteData({ ...routeData, distanceKm: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 flex justify-center items-center gap-2"
              >
                <PlusCircle className="w-5 h-5" /> Save Route
              </button>
            </form>
          </div>
        )}

        {/* TRIP TAB */}
        {activeTab === "trips" && (
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CalendarClock className="text-blue-600" /> Schedule a Trip
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              In a full production environment, the Bus ID and Route ID would be
              searchable dropdowns populated from the database.
            </p>
            <form onSubmit={handleTripSubmit} className="space-y-4 max-w-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bus ID
                  </label>
                  <input
                    required
                    type="number"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                    value={tripData.busId}
                    onChange={(e) =>
                      setTripData({ ...tripData, busId: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Route ID
                  </label>
                  <input
                    required
                    type="number"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                    value={tripData.routeId}
                    onChange={(e) =>
                      setTripData({ ...tripData, routeId: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departure Time
                </label>
                <input
                  required
                  type="datetime-local"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                  value={tripData.departureTime}
                  onChange={(e) =>
                    setTripData({ ...tripData, departureTime: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Arrival Time
                </label>
                <input
                  required
                  type="datetime-local"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                  value={tripData.arrivalTime}
                  onChange={(e) =>
                    setTripData({ ...tripData, arrivalTime: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ticket Fare (₹)
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                  value={tripData.fare}
                  onChange={(e) =>
                    setTripData({ ...tripData, fare: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 flex justify-center items-center gap-2"
              >
                <PlusCircle className="w-5 h-5" /> Schedule Trip
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
