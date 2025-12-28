import { Request, Response } from 'express';
import { FIRService } from './fir.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';

const firService = new FIRService();

/**
 * POST /api/firs
 * Create a new FIR (POLICE only)
 */
export const createFIR = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const organizationId = req.user!.organizationId;

  if (!organizationId) {
    throw ApiError.badRequest('Police officer must be associated with a police station');
  }

  const fir = await firService.createFIR(req.body, userId, organizationId);

  res.status(201).json({
    success: true,
    data: fir,
  });
});

/**
 * GET /api/firs/:firId
 * Get FIR by ID
 */
export const getFIRById = asyncHandler(async (req: Request, res: Response) => {
  const { firId } = req.params;
  const userId = req.user!.id;
  const userRole = req.user!.role;
  const organizationId = req.user!.organizationId;

  const fir = await firService.getFIRById(firId, userId, userRole, organizationId);

  res.status(200).json({
    success: true,
    data: fir,
  });
});
