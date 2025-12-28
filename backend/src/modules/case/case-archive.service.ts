import { prisma } from '../../prisma/client';
import { ApiError } from '../../utils/ApiError';
import { CaseState } from '@prisma/client';

export class CaseArchiveService {
  /**
   * POST /api/cases/:caseId/archive
   * Archive case (SHO/JUDGE only)
   */
  async archiveCase(caseId: string, userId: string, userRole: string) {
    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        currentState: true,
      },
    });

    if (!caseRecord) {
      throw ApiError.notFound('Case not found');
    }

    // Only CLOSED or JUDGMENT_DELIVERED cases can be archived
    const allowedStates = [CaseState.CLOSED, CaseState.JUDGMENT_DELIVERED];
    if (!allowedStates.includes(caseRecord.currentState!.state)) {
      throw ApiError.badRequest(
        `Cannot archive case from state: ${caseRecord.currentState!.state}`
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update case state
      await tx.currentCaseState.update({
        where: { caseId },
        data: {
          state: CaseState.ARCHIVED,
          updatedById: userId,
        },
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          caseId,
          userId,
          action: 'CASE_ARCHIVED',
          entityType: 'CASE',
          entityId: caseId,
          details: 'Case archived',
        },
      });

      return tx.case.findUnique({
        where: { id: caseId },
        include: {
          currentState: true,
        },
      });
    });

    return result;
  }
}
