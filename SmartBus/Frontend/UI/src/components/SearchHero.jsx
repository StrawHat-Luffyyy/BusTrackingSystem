import { useState, useEffect } from "react";
import { Star, Eye, Sparkles, Smile, Sun, ArrowDown, MapPin, Calendar, Clock, Download } from "lucide-react";
import { tripService, bookingService } from "../services/api";
import { useNavigate } from "react-router-dom";

const SearchHero = ({ auth }) => {
  const [locations, setLocations] = useState([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  
  const [trips, setTrips] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await tripService.getLocations();
        if (res.data.status === "success") setLocations(res.data.data.cities);
      } catch (error) {
        console.error("Failed to load locations", error);
      }
    };
    fetchLocations();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setHasSearched(true);
    try {
      const res = await tripService.searchTrips({ origin, destination, date });
      if (res.data.status === "success") {
        setTrips(res.data.data.trips);
      }
    } catch (err) {
      console.error(err);
      setTrips([]);
    }
  };

  const handleBook = async (tripId) => {
    if (!auth) {
      alert("Please log in to book a trip!");
      navigate("/login");
      return;
    }

    try {
      // In a broader iteration, we'd add seat selection UI. Defaulting to seat 1 for now.
      const res = await bookingService.createBooking({ tripId, seatNumbers: "1" });
      if (res.data.status === "success") {
        setSuccessModal(true);
        setTimeout(() => {
          setSuccessModal(false);
          navigate("/bookings"); // redirects them to their bookings page to see the new ticket
        }, 1500);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <div className="hero-container" style={{ minHeight: '80vh', padding: '6rem 2rem' }}>
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

      {hasSearched && (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 className="section-title">
            <Sparkles color="var(--accent-orange)" /> Search Results
          </h2>
          
          {trips.length === 0 ? (
            <div className="empty-state">
              <p style={{ color: 'var(--text-muted)' }}>No trips found matching your criteria.</p>
            </div>
          ) : (
            <div className="ticket-list">
              {trips.map((trip) => {
                const depDate = new Date(trip.departureTime);

                return (
                  <div key={trip.id} className="ticket-card">
                    <div className="ticket-left">
                      <span className="status-badge confirmed" style={{ borderColor: 'var(--accent-yellow)', color: 'var(--accent-yellow)', background: 'rgba(255, 230, 109, 0.1)' }}>
                        {trip.bus.busType} BUS
                      </span>
                      
                      <div className="route-info">
                        <div>
                          <h3 style={{ color: 'var(--text-main)' }}>{trip.route.origin}</h3>
                          <div style={{ paddingLeft: '0.75rem', margin: '0.5rem 0', borderLeft: '2px dashed rgba(255,255,255,0.2)', height: '20px' }}></div>
                          <h3 style={{ color: 'var(--text-main)' }}>{trip.route.destination}</h3>
                        </div>
                      </div>
                    </div>

                    <div className="ticket-right">
                      <div className="grid-details">
                        <div className="detail-item">
                          <p>Date</p>
                          <p>{depDate.toLocaleDateString()}</p>
                        </div>
                        <div className="detail-item">
                          <p>Time</p>
                          <p>{depDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                        </div>
                        <div className="detail-item">
                          <p>Distance</p>
                          <p>{trip.route.distanceKm} km</p>
                        </div>
                        <div className="detail-item">
                          <p>Seats</p>
                          <p style={{ color: 'var(--accent-blue)' }}>{trip.bus.totalSeats}</p>
                        </div>
                      </div>

                      <div className="ticket-action">
                        <div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Ticket Fare</p>
                          <p style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                            ₹{trip.fare.toFixed(2)}
                          </p>
                        </div>
                        <button onClick={() => handleBook(trip.id)} style={{ background: 'var(--text-main)', color: '#000' }}>
                          Book Ticket
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {successModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(5px)' }}>
          <div style={{ background: 'var(--bg-color)', padding: '3rem', borderRadius: '16px', border: '1px solid var(--accent-pink)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', animation: 'scaleIn 0.3s ease-out', boxShadow: '0 0 40px rgba(235, 94, 255, 0.2)' }}>
             <Sparkles size={48} color="var(--accent-pink)" />
             <h2 style={{ color: 'var(--text-main)', margin: 0 }}>Ticket Confirmed!</h2>
             <p style={{ color: 'var(--text-muted)' }}>Redirecting you to your stash...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchHero;
