import { useState, useEffect } from "react";
import { Star, Eye, Sparkles, Smile, Sun, ArrowDown } from "lucide-react";

const SearchHero = ({ onSearch = () => { } }) => {
  const [locations, setLocations] = useState([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

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
    onSearch({ origin, destination, date });
  };

  return (
    <div className="hero-container">
      {/* Playful Floating Shapes */}
      <Sun className="shape shape-1" />
      <Eye className="shape shape-2" />
      <Sparkles className="shape shape-3" />
      <Star className="shape shape-4" />
      <Smile className="shape shape-2" style={{ top: '60%', left: '15%', animationDelay: '-1s' }} />

      <div className="hero-subtext">Welcome to the future of transit.</div>
      <h1 className="hero-title">Smart<br />Bus</h1>

      <div className="hero-description">
        Express, track, and manage your journeys effortlessly.
      </div>

      <ArrowDown className="arrow-down" size={32} color="#a3a3a3" />

      <form onSubmit={handleSearch} className="hero-search-form">
        <div className="search-field">
          <label>From</label>
          <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
            <option value="">Select origin</option>
            {locations.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="search-field">
          <label>To</label>
          <select value={destination} onChange={(e) => setDestination(e.target.value)}>
            <option value="">Select destination</option>
            {locations.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="search-field">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button type="submit" className="search-btn">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchHero;
