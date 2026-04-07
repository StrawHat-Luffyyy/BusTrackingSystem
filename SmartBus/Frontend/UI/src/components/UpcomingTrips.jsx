import { useState, useEffect } from 'react';
import { tripService, bookingService } from '../services/api';
import { Clock, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UpcomingTrips = ({ auth }) => {
  const [trips, setTrips] = useState([]);
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
      const res = await bookingService.createBooking({ tripId, seatNumbers: "1" });
      if (res.data.status === "success") {
        window.location.href = "/bookings";
      }
    } catch(err) {
      console.log(err);
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
    </div>
  )
}

export default UpcomingTrips;
