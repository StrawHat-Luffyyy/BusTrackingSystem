import express from 'express';
import { getLocations } from '../controllers/routeController.js';
import { searchTrips, getTripSeatAvailability } from '../controllers/tripController.js';

const router = express.Router();

router.get('/locations', getLocations);
router.get('/search', searchTrips);
router.get('/:id/seats', getTripSeatAvailability);

export default router;