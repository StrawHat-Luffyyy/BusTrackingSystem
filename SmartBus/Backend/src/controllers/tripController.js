import { prisma } from "../server.js";
import catchAsync from "../utils/catchAsync.js";

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

  res.status(200).json({
    status: "success",
    results: trips.length,
    data: { trips },
  });
});
