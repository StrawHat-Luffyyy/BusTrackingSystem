import { useState, useEffect } from "react";
import { Star, Eye, Sparkles, Smile, Sun, ArrowDown, MapPin, Calendar, Clock, Download } from "lucide-react";
import { tripService, bookingService } from "../services/api";
import { useNavigate } from "react-router-dom";
import SeatMap from "./SeatMap.jsx";

const SearchHero = ({ auth }) => {
  const [locations, setLocations] = useState([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  
  const [trips, setTrips] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [seatModalOpen, setSeatModalOpen] = useState(false);
  const [activeTrip, setActiveTrip] = useState(null);
  const [seatInfo, setSeatInfo] = useState({ totalSeats: 0, bookedSeats: [] });
  const [seatLoading, setSeatLoading] = useState(false);
  
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
        setTrips(res.data.data.trips || []);
      }
    } catch (err) {
      console.error(err);
      setTrips([]);
    }
  };

  const openSeatModal = async (trip) => {
    if (!auth) {
      alert("Please log in to book a trip!");
      navigate("/login");
      return;
    }

    try {
      setSeatLoading(true);
      setActiveTrip(trip);
      setSeatModalOpen(true);
      const res = await tripService.getTripSeats(trip.id);
      setSeatInfo(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
      setSeatModalOpen(false);
      setActiveTrip(null);
    } finally {
      setSeatLoading(false);
    }
  };

  const confirmSeatBooking = async (selectedSeats) => {
    if (!activeTrip) return;
    try {
      const res = await bookingService.createBooking({
        tripId: activeTrip.id,
        seatNumbers: selectedSeats.join(","),
      });
      if (res.data.status === "success") {
        setSeatModalOpen(false);
        setActiveTrip(null);
        setSuccessModal(true);
        setTimeout(() => {
          setSuccessModal(false);
          navigate("/bookings");
        }, 1500);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
      // Refresh seat availability in case another user booked meanwhile.
      try {
        const res = await tripService.getTripSeats(activeTrip.id);
        setSeatInfo(res.data.data);
      } catch {}
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
                        <button onClick={() => openSeatModal(trip)} style={{ background: 'var(--text-main)', color: '#000' }}>
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

      {seatModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, padding: "1rem", backdropFilter: "blur(6px)" }}>
          <div style={{ width: "100%", maxWidth: 720, background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: "1.1rem" }}>Choose your seat</div>
                {activeTrip && (
                  <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    {activeTrip.route.origin} → {activeTrip.route.destination}
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setSeatModalOpen(false);
                  setActiveTrip(null);
                }}
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.12)", color: "var(--text-main)", padding: "0.5rem 0.75rem", borderRadius: 10, cursor: "pointer" }}
              >
                Close
              </button>
            </div>

            {seatLoading ? (
              <div style={{ color: "var(--text-muted)", padding: "2rem 0", textAlign: "center" }}>Loading seats...</div>
            ) : (
              <SeatMap
                totalSeats={seatInfo.totalSeats}
                bookedSeats={seatInfo.bookedSeats}
                seatPrice={activeTrip?.fare || 0}
                onConfirmBooking={confirmSeatBooking}
              />
            )}
          </div>
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
