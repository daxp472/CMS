import { prisma } from '../../prisma/client';
import { ApiError } from '../../utils/ApiError';

export class AuditService {
  /**
   * GET /api/cases/:caseId/audit-logs
   * Get audit logs for a case
   */
  async getAuditLogs(caseId: string) {
    // Verify case exists
    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!caseRecord) {
      throw ApiError.notFound('Case not found');
    }

    const logs = await prisma.auditLog.findMany({
      where: { caseId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return logs;
  }
}
