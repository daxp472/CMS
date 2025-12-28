import { Request, Response } from 'express';
import { CaseService } from './case.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';

const caseService = new CaseService();

/**
 * GET /api/cases/my
 * Get cases assigned to current user
 */
export const getMyCases = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const userRole = req.user!.role;
  const organizationId = req.user!.organizationId;

  const cases = await caseService.getMyCases(userId, userRole, organizationId);

  res.status(200).json({
    success: true,
    data: cases,
  });
});

/**
 * GET /api/cases/all
 * Get all cases with filters (SHO/COURT)
 */
export const getAllCases = asyncHandler(async (req: Request, res: Response) => {
  const userRole = req.user!.role;
  const organizationId = req.user!.organizationId;
  const organizationType = req.user!.organizationType;

  const filters = {
    state: req.query.state as string,
    category: req.query.category as string,
    assignedOfficerId: req.query.assignedOfficerId as string,
  };

  const cases = await caseService.getAllCases(filters, userRole, organizationId, organizationType);

  res.status(200).json({
    success: true,
    data: cases,
  });
});

/**
 * GET /api/cases/:caseId
 * Get case by ID
 */
export const getCaseById = asyncHandler(async (req: Request, res: Response) => {
  const { caseId } = req.params;
  const userId = req.user!.id;
  const userRole = req.user!.role;
  const organizationId = req.user!.organizationId;
  const organizationType = req.user!.organizationType;

  const caseRecord = await caseService.getCaseById(
    caseId,
    userId,
    userRole,
    organizationId,
    organizationType
  );

  res.status(200).json({
    success: true,
    data: caseRecord,
  });
});

/**
 * POST /api/cases/:caseId/assign
 * Assign case to officer (SHO only)
 */
export const assignCase = asyncHandler(async (req: Request, res: Response) => {
  const { caseId } = req.params;
  const { officerId } = req.body;
  const userId = req.user!.id;
  const organizationId = req.user!.organizationId;

  if (!organizationId) {
    throw ApiError.badRequest('SHO must be associated with a police station');
  }

  const updatedCase = await caseService.assignCase(caseId, officerId, userId, organizationId);

  res.status(200).json({
    success: true,
    data: updatedCase,
  });
});
