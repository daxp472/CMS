import { Router } from 'express';
import { body } from 'express-validator';
import { createDocument, getDocuments, finalizeDocument } from './document.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { isPolice, allowAll } from '../../middleware/role.middleware';
import { validate } from '../../middleware/validation.middleware';

const router = Router();

/**
 * POST /api/cases/:caseId/documents
 * Create document - POLICE only
 */
router.post(
  '/cases/:caseId/documents',
  authenticate,
  isPolice,
  [
    body('documentType')
      .isIn([
        'FIR',
        'CHARGESHEET',
        'INVESTIGATION_REPORT',
        'EVIDENCE_REPORT',
        'WITNESS_STATEMENT',
        'FORENSIC_REPORT',
        'COURT_ORDER',
        'JUDGMENT',
        'BAIL_DOCUMENT',
        'OTHER',
      ])
      .withMessage('Valid document type is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('filePath').notEmpty().withMessage('File path is required'),
    validate,
  ],
  createDocument
);

/**
 * GET /api/cases/:caseId/documents
 * List documents - all authenticated users
 */
router.get('/cases/:caseId/documents', authenticate, allowAll, getDocuments);

/**
 * POST /api/documents/:documentId/finalize
 * Finalize document - POLICE only
 */
router.post('/documents/:documentId/finalize', authenticate, isPolice, finalizeDocument);

export default router;
