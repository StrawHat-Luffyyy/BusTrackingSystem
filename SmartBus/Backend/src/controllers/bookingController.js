import { prisma } from "../server.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const createBooking = catchAsync(async (req, res, next) => {
  const { tripId, seatNumbers } = req.body; 

  if (!tripId || !seatNumbers) {
    return next(new AppError("Please provide tripId and seatNumbers.", 400));
  }

  const requestedSeats = seatNumbers.split(",").map((s) => s.trim());

  const booking = await prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({
      where: { id: tripId },
      include: {
        bookings: { where: { status: "CONFIRMED" } },
        bus: true,
      },
    });

    if (!trip) throw new AppError("Trip not found.", 404);

    const currentlyBookedSeats = trip.bookings.flatMap((b) =>
      b.seatNumbers.split(",").map((s) => s.trim()),
    );

    const isDoubleBooked = requestedSeats.some((seat) =>
      currentlyBookedSeats.includes(seat),
    );
    if (isDoubleBooked) {
      throw new AppError(
        "One or more selected seats are already booked. Please try again.",
        400,
      );
    }

    if (
      currentlyBookedSeats.length + requestedSeats.length >
      trip.bus.totalSeats
    ) {
      throw new AppError("Not enough available seats on this bus.", 400);
    }

    const newBooking = await tx.booking.create({
      data: {
        userId: req.user.id,
        tripId,
        seatNumbers: requestedSeats.join(","),
      },
    });

    return newBooking;
  });

  res.status(201).json({
    status: "success",
    data: { booking },
  });
});

export const getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await prisma.booking.findMany({
    where: { userId: req.user.id },
    include: {
      trip: {
        include: {
          bus: { select: { registrationNo: true, busType: true } },
          route: { select: { origin: true, destination: true } },
        },
      },
    },
    orderBy: { bookedAt: "desc" },
  });

  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: { bookings },
  });
});
