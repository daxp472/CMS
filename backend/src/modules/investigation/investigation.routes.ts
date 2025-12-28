import { Router } from 'express';
import { body } from 'express-validator';
import {
  createInvestigationEvent,
  getInvestigationEvents,
  createEvidence,
  getEvidence,
  createWitness,
  getWitnesses,
  createAccused,
  getAccused,
} from './investigation.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { isPolice } from '../../middleware/role.middleware';
import { validate } from '../../middleware/validation.middleware';

const router = Router();

/**
 * Investigation Events
 */
router.post(
  '/cases/:caseId/investigation-events',
  authenticate,
  isPolice,
  [
    body('eventType').notEmpty().withMessage('Event type is required'),
    body('eventDate').isISO8601().withMessage('Valid event date is required'),
    body('description').notEmpty().withMessage('Description is required'),
    validate,
  ],
  createInvestigationEvent
);

router.get('/cases/:caseId/investigation-events', authenticate, isPolice, getInvestigationEvents);

/**
 * Evidence
 */
router.post(
  '/cases/:caseId/evidence',
  authenticate,
  isPolice,
  [
    body('evidenceType')
      .isIn(['PHYSICAL', 'DIGITAL', 'DOCUMENTARY', 'TESTIMONIAL', 'FORENSIC', 'OTHER'])
      .withMessage('Valid evidence type is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('collectedDate').isISO8601().withMessage('Valid collected date is required'),
    validate,
  ],
  createEvidence
);

router.get('/cases/:caseId/evidence', authenticate, isPolice, getEvidence);

/**
 * Witnesses
 */
router.post(
  '/cases/:caseId/witnesses',
  authenticate,
  isPolice,
  [
    body('name').notEmpty().withMessage('Witness name is required'),
    body('witnessType')
      .isIn(['EYE_WITNESS', 'EXPERT_WITNESS', 'CHARACTER_WITNESS', 'OTHER'])
      .withMessage('Valid witness type is required'),
    validate,
  ],
  createWitness
);

router.get('/cases/:caseId/witnesses', authenticate, isPolice, getWitnesses);

/**
 * Accused
 */
router.post(
  '/cases/:caseId/accused',
  authenticate,
  isPolice,
  [body('name').notEmpty().withMessage('Accused name is required'), validate],
  createAccused
);

router.get('/cases/:caseId/accused', authenticate, isPolice, getAccused);

export default router;
