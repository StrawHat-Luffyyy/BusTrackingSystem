import express from 'express';
import { createRoute, createBus, createTrip } from '../controllers/adminController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 1. First barrier: You must be logged in
router.use(protect);

// 2. Second barrier: You must be an ADMIN or OPERATOR
router.use(restrictTo('ADMIN', 'OPERATOR'));

// If you pass both barriers, you can access these routes:
router.post('/routes', createRoute);
router.post('/buses', createBus);
router.post('/trips', createTrip);

export default router;