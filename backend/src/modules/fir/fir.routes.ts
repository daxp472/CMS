import { Router } from 'express';
import { body } from 'express-validator';
import { createFIR, getFIRById } from './fir.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { isPolice, allowAll } from '../../middleware/role.middleware';
import { validate } from '../../middleware/validation.middleware';

const router = Router();

/**
 * POST /api/firs
 * Create new FIR - POLICE only
 */
router.post(
  '/',
  authenticate,
  isPolice,
  [
    body('complainantName').notEmpty().withMessage('Complainant name is required'),
    body('complainantContact').notEmpty().withMessage('Complainant contact is required'),
    body('incidentDate').isISO8601().withMessage('Valid incident date is required'),
    body('incidentLocation').notEmpty().withMessage('Incident location is required'),
    body('incidentDescription').notEmpty().withMessage('Incident description is required'),
    body('category').isIn(['CRIMINAL', 'CIVIL', 'TRAFFIC', 'OTHER']).withMessage('Valid category is required'),
    validate,
  ],
  createFIR
);

/**
 * GET /api/firs/:firId
 * Get FIR by ID - all authenticated users
 */
router.get('/:firId', authenticate, allowAll, getFIRById);

export default router;
