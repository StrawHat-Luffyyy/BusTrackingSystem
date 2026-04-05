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
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto border border-gray-100">
      {/* Legend */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gray-200 border border-gray-300"></div>
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-600 border border-blue-700"></div>
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-red-100 border border-red-300 flex items-center justify-center">
            <User className="w-3 h-3 text-red-400" />
          </div>
          <span className="text-gray-600">Booked</span>
        </div>
      </div>

      {/* The Bus Layout (Assuming 2x2 seating with an aisle) */}
      <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-200 mb-6 relative">
        {/* Front of Bus Indicator */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-widest border border-gray-200 rounded-full">
          Front
        </div>

        <div className="grid grid-cols-5 gap-y-4 gap-x-2 mt-4">
          {seats.map((seat) => {
            const isBooked = bookedSeats.includes(seat);
            const isSelected = selectedSeats.includes(seat);

            // Create an empty aisle column in the middle (column 3)
            const isAisle = parseInt(seat) % 4 === 2;

            return (
              <div key={seat} className="contents">
                <button
                  disabled={isBooked}
                  onClick={() => toggleSeat(seat)}
                  className={`
                    h-12 w-full rounded-t-xl rounded-b-md font-semibold transition-all duration-200
                    flex items-center justify-center text-sm shadow-sm
                    ${
                      isBooked
                        ? "bg-red-50 text-red-300 border-red-200 cursor-not-allowed"
                        : isSelected
                          ? "bg-blue-600 text-white border-blue-700 hover:bg-blue-700 shadow-blue-200 shadow-inner"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                    }
                    border-2
                  `}
                >
                  {isBooked ? <User className="w-4 h-4 opacity-50" /> : seat}
                </button>

                {/* Render the aisle space */}
                {isAisle && <div className="w-full h-full"></div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Checkout Summary */}
      <div className="bg-slate-900 text-white rounded-xl p-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-400 mb-1">Total Price</p>
          <p className="text-2xl font-bold">
            ₹{(selectedSeats.length * seatPrice).toFixed(2)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {selectedSeats.length} seat(s) selected
          </p>
        </div>
        <button
          onClick={handleConfirm}
          disabled={selectedSeats.length === 0}
          className={`
            px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all
            ${
              selectedSeats.length > 0
                ? "bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/30"
                : "bg-slate-800 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          Book Now
          <Check className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SeatMap;
