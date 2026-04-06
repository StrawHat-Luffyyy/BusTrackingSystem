import express from 'express';
import { getLocations } from '../controllers/routeController.js';
import { searchTrips } from '../controllers/tripController.js';

const router = express.Router();

router.get('/locations', getLocations);
router.get('/search', searchTrips);

export default router;