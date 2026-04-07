import { prisma } from "../prismaClient.js";
import catchAsync from "../utils/catchAsync.js";

export const getLocations = catchAsync(async (req, res, next) => {
  const routes = await prisma.route.findMany({
    select: { origin: true, destination: true },
  });

  const uniqueCities = [
    ...new Set(routes.flatMap((r) => [r.origin, r.destination])),
  ].sort();

  res.status(200).json({
    status: "success",
    data: {
      cities: uniqueCities,
    },
  });
});
