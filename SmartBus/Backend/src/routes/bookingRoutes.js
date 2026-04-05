import express from "express";
import {
  createBooking,
  getMyBookings,
} from "../controllers/bookingController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createBooking);
router.get("/my-bookings", getMyBookings);

export default router;
