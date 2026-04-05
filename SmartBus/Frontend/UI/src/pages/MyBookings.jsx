import { useState, useEffect } from "react";
import { Ticket, Calendar, Clock, MapPin, Download } from "lucide-react";
import { bookingService } from "../services/api.js";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        // One clean line of code. The cookie is sent automatically!
        const response = await bookingService.getMyBookings();
        setBookings(response.data.data.bookings);
        setIsLoading(false);
      } catch (error) {
        // The error is already logged neatly by the interceptor
        console.error("Failed to load tickets");
        setIsLoading(false);
      }
    };
    fetchMyBookings();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        Loading your tickets...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <Ticket className="w-8 h-8 text-blue-600" /> My Trips
      </h1>

      {bookings.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-gray-100 text-center shadow-sm">
          <p className="text-gray-500 mb-4">
            You haven't booked any trips yet.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
            Find a Bus
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const depDate = new Date(booking.trip.departureTime);

            return (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 flex flex-col md:flex-row"
              >
                {/* Left Side: Route & Status */}
                <div className="bg-slate-900 p-6 text-white flex-1 relative overflow-hidden">
                  {/* Decorative background element */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>

                  <div className="flex justify-between items-start mb-6">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                        booking.status === "CONFIRMED"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {booking.status}
                    </span>
                    <span className="text-gray-400 text-sm">
                      Booking #{booking.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-2">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        Origin
                      </p>
                      <p className="text-xl font-bold">
                        {booking.trip.route.origin}
                      </p>
                    </div>
                  </div>

                  <div className="pl-2.5 my-1 border-l-2 border-dashed border-gray-700 h-6 ml-2"></div>

                  <div className="flex items-center gap-4">
                    <MapPin className="w-5 h-5 text-red-400" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        Destination
                      </p>
                      <p className="text-xl font-bold">
                        {booking.trip.route.destination}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Details & Action */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-white relative">
                  {/* Perforated edge effect between sections */}
                  <div className="hidden md:block absolute left-0 top-0 bottom-0 w-4 -ml-2 flex flex-col justify-between py-2">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full bg-gray-50 border border-gray-200"
                      ></div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 pl-4">
                    <div>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Date
                      </p>
                      <p className="font-semibold text-gray-900">
                        {depDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Time
                      </p>
                      <p className="font-semibold text-gray-900">
                        {depDate.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Bus / Class</p>
                      <p className="font-semibold text-gray-900">
                        {booking.trip.bus.busType}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Seat(s)</p>
                      <p className="font-bold text-blue-600 text-lg">
                        {booking.seatNumbers}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed border-gray-200 pl-4">
                    <div>
                      <p className="text-xs text-gray-500">Total Paid</p>
                      <p className="text-xl font-black text-gray-900">
                        ₹
                        {(
                          booking.trip.fare *
                          booking.seatNumbers.split(",").length
                        ).toFixed(2)}
                      </p>
                    </div>
                    {/* Preparing for Day 13: S3 Ticket Downloads */}
                    <button className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-lg transition-colors">
                      <Download className="w-4 h-4" /> E-Ticket
                    </button>
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
