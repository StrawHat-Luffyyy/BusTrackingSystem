import { prisma } from "../prismaClient.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import { uploadToS3 } from "../utils/s3Upload.js";

export const createRoute = catchAsync(async (req, res, next) => {
  const { routeName, origin, destination, distanceKm } = req.body;
  if (!origin || !destination) {
    return next(
      new AppError("Please provide both origin and destination.", 400),
    );
  }
  const newRoute = await prisma.route.create({
    data: {
      routeName: routeName || `${origin} to ${destination}`,
      origin,
      destination,
      distanceKm,
    },
  });

  res.status(201).json({ status: "success", data: { route: newRoute } });
});

export const createBus = catchAsync(async (req, res, next) => {
  const { registrationNo, totalSeats, busType } = req.body;
  let photoUrl = null;
  if (!registrationNo || !totalSeats || !busType) {
    return next(new AppError("Please provide all bus details.", 400));
  }
  if (req.file) {
    photoUrl = await uploadToS3(req.file);
  }
  const newBus = await prisma.bus.create({
    data: {
      registrationNo,
      totalSeats: parseInt(totalSeats),
      busType,
      imageUrl: photoUrl, 
      operatorId: req.user.id,
    },
  });
  res.status(201).json({ status: "success", data: { bus: newBus } });
});

export const createTrip = catchAsync(async (req, res, next) => {
  const { busId, routeId, departureTime, arrivalTime, fare } = req.body;

  if (!busId || !routeId || !departureTime || !arrivalTime || !fare) {
    return next(
      new AppError(
        "Please provide all trip details (bus, route, times, fare).",
        400,
      ),
    );
  }

  if (new Date(departureTime) < new Date()) {
    return next(new AppError("Departure time cannot be in the past.", 400));
  }

  const newTrip = await prisma.trip.create({
    data: {
      busId,
      routeId,
      departureTime: new Date(departureTime),
      arrivalTime: new Date(arrivalTime),
      fare,
    },
  });

  res.status(201).json({ status: "success", data: { trip: newTrip } });
});
