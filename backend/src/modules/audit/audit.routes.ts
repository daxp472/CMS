import { Router } from 'express';
import { getAuditLogs } from './audit.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';

const router = Router();

/**
 * GET /api/cases/:caseId/audit-logs
 * Get audit logs - SHO/COURT only
 */
router.get(
  '/cases/:caseId/audit-logs',
  authenticate,
  requireRole(['SHO', 'COURT_CLERK', 'JUDGE']),
  getAuditLogs
);

export default router;
