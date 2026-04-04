import { useState, useEffect } from "react";
import { MapPin, Calendar, Search } from "lucide-react";

const SearchHero = ({ onSearch }) => {
  const [locations, setLocations] = useState([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

  // Fetch unique cities when the component loads
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/trips/locations");
        const data = await res.json();
        if (data.status === "success") setLocations(data.data.cities);
      } catch (error) {
        console.error("Failed to load locations", error);
      }
    };
    fetchLocations();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Pass the search parameters up to the parent Page component
    onSearch({ origin, destination, date });
  };

  return (
    <div className="relative bg-slate-900 h-96 flex items-center justify-center">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/path/to/bus-bg.jpg')] bg-cover bg-center opacity-30"></div>
      </div>

      {/* Main Search Box */}
      <div className="relative z-10 w-full max-w-4xl px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-8">
          Find Your Next Ride
        </h1>

        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl shadow-2xl p-4 flex flex-col md:flex-row gap-4 items-end"
        >
          {/* Origin Input */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent appearance-none"
              >
                <option value="">Select city</option>
                {locations.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Destination Input */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent appearance-none"
              >
                <option value="">Select city</option>
                {locations.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Input */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded-lg transition duration-200 flex items-center justify-center h-[42px]"
          >
            <Search className="h-5 w-5 mr-2" />
            Search Buses
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchHero;
