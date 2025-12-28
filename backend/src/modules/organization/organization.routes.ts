import { Router } from 'express';
import { getAllPoliceStations, getAllCourts } from './organization.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { allowAll } from '../../middleware/role.middleware';

const router = Router();

/**
 * GET /api/police-stations
 * Get all police stations - accessible by all authenticated users
 */
router.get('/police-stations', authenticate, allowAll, getAllPoliceStations);

/**
 * GET /api/courts
 * Get all courts - accessible by all authenticated users
 */
router.get('/courts', authenticate, allowAll, getAllCourts);

export default router;
