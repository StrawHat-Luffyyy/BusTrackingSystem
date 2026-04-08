import { prisma } from "../prismaClient.js";
import catchAsync from "../utils/catchAsync.js";
import { v4 as uuidv4 } from "uuid";

export const searchTrips = catchAsync(async (req, res, next) => {
  const { origin, destination, date } = req.query;

  const filter = {};

  if (origin || destination) {
    filter.route = {};
    if (origin) filter.route.origin = origin;
    if (destination) filter.route.destination = destination;
  }

  if (date) {
    // We want to find trips that happen ON this day, so we create a 24-hour window
    const searchDate = new Date(date);
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);

    filter.departureTime = {
      gte: searchDate,
      lt: nextDay,
    };
  }

  const trips = await prisma.trip.findMany({
    where: filter,
    include: {
      bus: {
        select: { registrationNo: true, busType: true, totalSeats: true },
      },
      route: {
        select: { origin: true, destination: true, distanceKm: true },
      },
    },
    orderBy: { departureTime: "asc" }, // Earliest buses first
  });

  // Dev convenience: if nothing found, auto-create a trip so the UI always has something to book.
  // This should never run in production.
  if (trips.length === 0 && process.env.NODE_ENV !== "production") {
    const originCity = origin || "Ahmedabad";
    const destinationCity = destination || "Surat";
    const dateStr = date || new Date().toISOString().slice(0, 10);

    let route = await prisma.route.findFirst({
      where: { origin: originCity, destination: destinationCity },
    });
    if (!route) {
      route = await prisma.route.create({
        data: {
          routeName: `${originCity} to ${destinationCity}`,
          origin: originCity,
          destination: destinationCity,
          distanceKm: 250,
        },
      });
    }

    const operator = await prisma.user.findFirst({
      where: { role: "OPERATOR" },
    });

    const operatorId = operator?.id;

    if (operatorId) {
      const busType = Math.random() > 0.5 ? "AC" : "NON_AC";
      const bus = await prisma.bus.create({
        data: {
          operatorId,
          registrationNo: `SB-${uuidv4().slice(0, 8).toUpperCase()}`,
          totalSeats: 40,
          busType,
        },
      });

      const departureTime = new Date(`${dateStr}T09:00:00.000Z`);
      const arrivalTime = new Date(departureTime);
      arrivalTime.setHours(arrivalTime.getHours() + 3);

      await prisma.trip.create({
        data: {
          busId: bus.id,
          routeId: route.id,
          departureTime,
          arrivalTime,
          fare: busType === "AC" ? 899 : 649,
        },
      });
    }

    const seededTrips = await prisma.trip.findMany({
      where: filter,
      include: {
        bus: {
          select: { registrationNo: true, busType: true, totalSeats: true },
        },
        route: {
          select: { origin: true, destination: true, distanceKm: true },
        },
      },
      orderBy: { departureTime: "asc" },
    });

    return res.status(200).json({
      status: "success",
      results: seededTrips.length,
      data: { trips: seededTrips },
    });
  }

  res.status(200).json({
    status: "success",
    results: trips.length,
    data: { trips },
  });
});

export const getTripSeatAvailability = catchAsync(async (req, res, next) => {
  const tripId = Number(req.params.id);

  if (!tripId) {
    return res.status(400).json({
      status: "error",
      message: "Invalid trip id.",
    });
  }

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      bus: { select: { totalSeats: true } },
      bookings: { where: { status: "CONFIRMED" }, select: { seatNumbers: true } },
    },
  });

  if (!trip) {
    return res.status(404).json({
      status: "error",
      message: "Trip not found.",
    });
  }

  const bookedSeats = trip.bookings.flatMap((b) =>
    b.seatNumbers.split(",").map((s) => s.trim()).filter(Boolean),
  );

  res.status(200).json({
    status: "success",
    data: {
      totalSeats: trip.bus.totalSeats,
      bookedSeats,
    },
  });
});
