import { useState, useEffect } from "react";
import { Ticket, Download } from "lucide-react";
import { bookingService } from "../services/api.js";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const response = await bookingService.getMyBookings();
        setBookings(response.data.data.bookings);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load tickets");
        setIsLoading(false);
      }
    };
    fetchMyBookings();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        Loading your tickets...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: 'auto', padding: '4rem 2rem' }} className="printable-container">
      <h1 className="section-title hide-on-print">
        <Ticket color="var(--accent-pink)" size={36} /> My Trips
      </h1>

      {bookings.length === 0 ? (
        <div className="empty-state hide-on-print">
          <p style={{ color: 'var(--text-muted)' }}>You haven't booked any trips yet.</p>
          <button className="primary-btn" style={{ maxWidth: '200px', margin: '1rem auto' }}>
            Find a Bus
          </button>
        </div>
      ) : (
        <div className="ticket-list">
          {bookings.map((booking) => {
            const depDate = new Date(booking.trip.departureTime);

            return (
              <div key={booking.id} className="ticket-card printable-card">
                <div className="ticket-left printable-layer">
                  <span className={`status-badge ${booking.status === "CONFIRMED" ? "confirmed" : ""}`}>
                    {booking.status}
                  </span>

                  <div className="route-info">
                    <div>
                      <h3 style={{ color: 'var(--accent-blue)' }}>{booking.trip.route.origin}</h3>
                      <div style={{ paddingLeft: '0.75rem', margin: '0.5rem 0', borderLeft: '2px dashed rgba(255,255,255,0.2)', height: '20px' }}></div>
                      <h3 style={{ color: 'var(--accent-orange)' }}>{booking.trip.route.destination}</h3>
                    </div>
                  </div>
                </div>

                <div className="ticket-right printable-layer">
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
                      <p>Bus / Class</p>
                      <p>{booking.trip.bus.busType}</p>
                    </div>
                    <div className="detail-item">
                      <p>Seat(s)</p>
                      <p style={{ color: 'var(--accent-pink)' }}>{booking.seatNumbers}</p>
                    </div>
                  </div>

                  <div className="ticket-action hide-on-print">
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Total Paid</p>
                      <p style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                        ₹{(booking.trip.fare * booking.seatNumbers.split(",").length).toFixed(2)}
                      </p>
                    </div>
                    <button onClick={() => window.print()}><Download size={14} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} /> E-Ticket</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
