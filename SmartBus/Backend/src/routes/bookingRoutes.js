import express from "express";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
} from "../controllers/bookingController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createBooking);
router.get("/my-bookings", getMyBookings);
router.patch("/:id/cancel", cancelBooking);

export default router;
