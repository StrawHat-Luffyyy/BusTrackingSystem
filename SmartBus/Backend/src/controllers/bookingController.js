import { prisma } from "../prismaClient.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const createBooking = catchAsync(async (req, res, next) => {
  const { tripId, seatNumbers } = req.body; 

  if (!tripId || !seatNumbers) {
    return next(new AppError("Please provide tripId and seatNumbers.", 400));
  }

  const rawSeatNumbers = String(seatNumbers).trim();
  const isAutoSeatPick = rawSeatNumbers.toUpperCase() === "AUTO";
  const requestedSeats = isAutoSeatPick
    ? []
    : rawSeatNumbers
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

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

    // "Quick book" mode: backend selects the next available seat safely.
    if (isAutoSeatPick) {
      const allSeats = Array.from({ length: trip.bus.totalSeats }, (_, i) =>
        String(i + 1),
      );
      const nextAvailable = allSeats.find((s) => !currentlyBookedSeats.includes(s));
      if (!nextAvailable) {
        throw new AppError("Not enough available seats on this bus.", 400);
      }
      requestedSeats.push(nextAvailable);
    }

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

export const cancelBooking = catchAsync(async (req, res, next) => {
  const bookingId = Number(req.params.id);
  if (!bookingId) {
    return next(new AppError("Invalid booking id.", 400));
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking || booking.userId !== req.user.id) {
    return next(new AppError("Booking not found.", 404));
  }

  if (booking.status === "CANCELLED") {
    return res.status(200).json({ status: "success", data: { booking } });
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
  });

  res.status(200).json({
    status: "success",
    data: { booking: updated },
  });
});
