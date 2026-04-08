import { useState, useEffect } from "react";
import { Ticket, Download } from "lucide-react";
import { bookingService } from "../services/api.js";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const printTicket = (bookingId) => {
    const el = document.getElementById(`ticket-${bookingId}`);
    if (!el) return;

    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) return;

    w.document.open();
    w.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SmartBus</title>
    <style>
      @page { margin: 12mm; }
      body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
      .wrap { padding: 0; }
      .hide-on-print { display: none !important; }
      .ticket-card { border: 2px solid #000; border-radius: 14px; overflow: hidden; width: 720px; max-width: 100%; }
      .ticket-left, .ticket-right { padding: 24px; background: #f9f9f9; }
      .ticket-card { display: flex; }
      .ticket-left { border-right: 2px dashed #333; }
      .status-badge { display:inline-block; padding: 8px 14px; border: 1px solid #000; border-radius: 999px; font-weight: 700; font-size: 12px; letter-spacing: 0.08em; }
      .route-info h3 { margin: 0; font-size: 34px; }
      .grid-details { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 18px; }
      .detail-item p { margin: 0; }
      .detail-item p:first-child { font-size: 12px; text-transform: uppercase; opacity: 0.7; margin-bottom: 6px; }
      .detail-item p:last-child { font-size: 18px; font-weight: 700; }
    </style>
  </head>
  <body>
    <div class="wrap">
      ${el.outerHTML}
    </div>
    <script>
      window.onload = () => {
        window.print();
        window.close();
      };
    </script>
  </body>
</html>`);
    w.document.close();
  };

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
            const canCancel = booking.status === "CONFIRMED";

            return (
              <div key={booking.id} id={`ticket-${booking.id}`} className="ticket-card printable-card">
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
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                      {canCancel && (
                        <button
                          onClick={async () => {
                            const ok = window.confirm("Cancel this booking?");
                            if (!ok) return;
                            setCancellingId(booking.id);
                            try {
                              await bookingService.cancelBooking(booking.id);
                              setBookings((prev) =>
                                prev.filter((b) => b.id !== booking.id),
                              );
                            } catch (e) {
                              alert(e.response?.data?.message || "Failed to cancel booking.");
                            } finally {
                              setCancellingId(null);
                            }
                          }}
                          disabled={cancellingId === booking.id}
                          style={{ opacity: cancellingId === booking.id ? 0.7 : 1 }}
                        >
                          {cancellingId === booking.id ? "Cancelling..." : "Cancel"}
                        </button>
                      )}
                      <button onClick={() => printTicket(booking.id)}>
                        <Download size={14} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} /> E-Ticket
                      </button>
                    </div>
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
