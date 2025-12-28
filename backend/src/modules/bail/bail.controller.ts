import { Request, Response } from 'express';
import { BailService } from './bail.service';
import { asyncHandler } from '../../utils/asyncHandler';

const bailService = new BailService();

/**
 * POST /api/cases/:caseId/bail-applications
 */
export const createBailApplication = asyncHandler(async (req: Request, res: Response) => {
  const { caseId } = req.params;
  const userId = req.user!.id;

  const bailApp = await bailService.createBailApplication(caseId, req.body, userId);

  res.status(201).json({
    success: true,
    data: bailApp,
  });
});

/**
 * GET /api/cases/:caseId/bail-applications
 */
export const getBailApplications = asyncHandler(async (req: Request, res: Response) => {
  const { caseId } = req.params;

  const bailApps = await bailService.getBailApplications(caseId);

  res.status(200).json({
    success: true,
    data: bailApps,
  });
});
