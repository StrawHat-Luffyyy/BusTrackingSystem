import { useState, useEffect } from 'react';
import { tripService, bookingService } from '../services/api';
import { Clock, Navigation, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UpcomingTrips = ({ auth }) => {
  const [trips, setTrips] = useState([]);
  const [successModal, setSuccessModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTrips = async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];
      try {
        const res = await tripService.searchTrips({ date: dateStr });
        setTrips(res.data.data.trips);
      } catch (err) {
        console.error(err);
      }
    };
    loadTrips();
  }, []);

  const handleQuickBook = async (tripId) => {
    if (!auth) {
      alert("Please login first to book.");
      navigate("/login");
      return;
    }
    try {
      const res = await bookingService.createBooking({ tripId, seatNumbers: "AUTO" });
      if (res.data.status === "success") {
        setSuccessModal(true);
        setTimeout(() => {
          setSuccessModal(false);
          navigate("/bookings");
        }, 1500);
      }
    } catch(err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  }

  if (trips.length === 0) return null;

  return (
    <div style={{ padding: '4rem', width: '100%', maxWidth: '1400px', margin: '0 auto', zIndex: 10, position: 'relative' }}>
      <h3 style={{ fontFamily: 'DM Serif Display', fontSize: '2.5rem', margin: '0 0 2rem 0', color: 'var(--text-main)' }}>Flash Deals for Tomorrow</h3>
      <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        {trips.map(trip => {
           const depDate = new Date(trip.departureTime);
           return (
             <div key={trip.id} style={{ minWidth: '350px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--accent-blue)', fontWeight: 700, fontSize: '1.2rem' }}>{trip.route.origin}</span>
                  <Navigation size={20} color="var(--text-muted)" />
                  <span style={{ color: 'var(--accent-orange)', fontWeight: 700, fontSize: '1.2rem' }}>{trip.route.destination}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  <Clock size={16} /> <span>{depDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>₹{trip.fare}</span>
                  <button onClick={() => handleQuickBook(trip.id)} className="primary-btn" style={{ margin: 0, padding: '0.5rem 1.5rem', width: 'auto', background: 'var(--accent-pink)', color: '#000' }}>Quick Book</button>
                </div>
             </div>
           );
        })}
      </div>

      {successModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(5px)' }}>
          <div style={{ background: 'var(--bg-color)', padding: '3rem', borderRadius: '16px', border: '1px solid var(--accent-pink)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', animation: 'scaleIn 0.3s ease-out', boxShadow: '0 0 40px rgba(235, 94, 255, 0.2)' }}>
             <Sparkles size={48} color="var(--accent-pink)" />
             <h2 style={{ color: 'var(--text-main)', margin: 0 }}>Ticket Booked!</h2>
             <p style={{ color: 'var(--text-muted)' }}>Check it in the Bookings section.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default UpcomingTrips;
