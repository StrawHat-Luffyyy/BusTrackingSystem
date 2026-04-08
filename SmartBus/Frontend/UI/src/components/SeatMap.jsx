import { useState } from "react";
import { User, Check } from "lucide-react";

const SeatMap = ({
  totalSeats,
  bookedSeats = [],
  seatPrice = 25.0,
  onConfirmBooking,
}) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const seats = Array.from({ length: totalSeats }, (_, i) =>
    (i + 1).toString(),
  );

  const toggleSeat = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return; // Can't select booked seats

    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber],
    );
  };

  const handleConfirm = () => {
    if (selectedSeats.length > 0) {
      onConfirmBooking(selectedSeats);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 520,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 16,
        padding: "1.25rem",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Legend */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "0.75rem",
          alignItems: "center",
          paddingBottom: "1rem",
          marginBottom: "1rem",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          fontSize: "0.8rem",
          color: "var(--text-muted)",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: 18, height: 18, borderRadius: 6, border: "1px solid rgba(255,255,255,0.18)" }} />
          <span>Available</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: 18, height: 18, borderRadius: 6, background: "var(--accent-blue)" }} />
          <span>Selected</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 6,
              background: "rgba(255,133,179,0.18)",
              border: "1px solid rgba(255,133,179,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={12} color="var(--accent-pink)" />
          </div>
          <span>Booked</span>
        </div>
      </div>

      {/* The Bus Layout (Assuming 2x2 seating with an aisle) */}
      <div
        style={{
          background: "rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 16,
          padding: "1rem",
          marginBottom: "1rem",
          position: "relative",
        }}
      >
        {/* Front of Bus Indicator */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.14)",
            color: "var(--text-muted)",
            padding: "0.25rem 0.6rem",
            borderRadius: 999,
            fontSize: "0.7rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Front
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "0.6rem 0.45rem",
            marginTop: "1rem",
          }}
        >
          {seats.map((seat) => {
            const isBooked = bookedSeats.includes(seat);
            const isSelected = selectedSeats.includes(seat);

            // Create an empty aisle column in the middle (column 3)
            const isAisle = parseInt(seat) % 4 === 2;

            return (
              <div key={seat} style={{ display: "contents" }}>
                <button
                  disabled={isBooked}
                  onClick={() => toggleSeat(seat)}
                  style={{
                    height: 44,
                    width: "100%",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: isBooked
                      ? "rgba(255,133,179,0.12)"
                      : isSelected
                        ? "var(--accent-blue)"
                        : "rgba(255,255,255,0.06)",
                    color: isBooked
                      ? "var(--text-muted)"
                      : isSelected
                        ? "#000"
                        : "var(--text-main)",
                    cursor: isBooked ? "not-allowed" : "pointer",
                    fontWeight: 800,
                    boxShadow: isSelected ? "0 10px 24px rgba(112,214,255,0.25)" : "none",
                  }}
                >
                  {isBooked ? <User size={16} color="var(--accent-pink)" /> : seat}
                </button>

                {/* Render the aisle space */}
                {isAisle && <div />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Checkout Summary */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          borderTop: "1px solid rgba(255,255,255,0.12)",
          paddingTop: "1rem",
        }}
      >
        <div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>Total Price</p>
          <p style={{ fontSize: "1.6rem", fontWeight: 900, margin: "0.25rem 0 0 0" }}>
            ₹{(selectedSeats.length * seatPrice).toFixed(2)}
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0.25rem 0 0 0" }}>
            {selectedSeats.length} seat(s) selected
          </p>
        </div>
        <button
          onClick={handleConfirm}
          disabled={selectedSeats.length === 0}
          className="primary-btn"
          style={{
            marginTop: 0,
            width: "auto",
            padding: "0.75rem 1.25rem",
            background: selectedSeats.length ? "var(--accent-blue)" : "rgba(255,255,255,0.12)",
            color: selectedSeats.length ? "#000" : "var(--text-muted)",
            cursor: selectedSeats.length ? "pointer" : "not-allowed",
          }}
        >
          Book Now <Check size={18} />
        </button>
      </div>
    </div>
  );
};

export default SeatMap;
