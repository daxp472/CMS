import { Request, Response } from 'express';
import { TimelineService } from './timeline.service';
import { asyncHandler } from '../../utils/asyncHandler';

const timelineService = new TimelineService();

/**
 * GET /api/cases/:caseId/timeline
 */
export const getCaseTimeline = asyncHandler(async (req: Request, res: Response) => {
  const { caseId } = req.params;

  const timeline = await timelineService.getCaseTimeline(caseId);

  res.status(200).json({
    success: true,
    data: timeline,
  });
});
