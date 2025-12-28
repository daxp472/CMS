import { prisma } from '../../prisma/client';
import { ApiError } from '../../utils/ApiError';

export class TimelineService {
  /**
   * GET /api/cases/:caseId/timeline
   * Get case timeline
   */
  async getCaseTimeline(caseId: string) {
    // Verify case exists
    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        fir: true,
        currentState: true,
        policeStation: true,
        court: true,
      },
    });

    if (!caseRecord) {
      throw ApiError.notFound('Case not found');
    }

    // Gather all timeline events from different sources
    const [investigationEvents, courtActions, documents, bailApps, auditLogs] = await Promise.all([
      prisma.investigationEvent.findMany({
        where: { caseId },
        select: {
          id: true,
          eventType: true,
          eventDate: true,
          description: true,
          createdAt: true,
        },
      }),
      prisma.courtAction.findMany({
        where: { caseId },
        select: {
          id: true,
          actionType: true,
          actionDate: true,
          description: true,
          createdAt: true,
        },
      }),
      prisma.document.findMany({
        where: { caseId },
        select: {
          id: true,
          documentType: true,
          title: true,
          createdAt: true,
        },
      }),
      prisma.bailApplication.findMany({
        where: { caseId },
        select: {
          id: true,
          applicantName: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.auditLog.findMany({
        where: {
          caseId,
          action: {
            in: [
              'FIR_REGISTERED',
              'CASE_ASSIGNED',
              'CASE_SUBMITTED_TO_COURT',
              'CASE_INTAKE',
              'INVESTIGATION_COMPLETE',
            ],
          },
        },
        select: {
          id: true,
          action: true,
          details: true,
          timestamp: true,
        },
      }),
    ]);

    // Combine and sort all events
    const timeline = [
      ...investigationEvents.map((e) => ({
        id: e.id,
        type: 'INVESTIGATION_EVENT',
        title: e.eventType,
        description: e.description,
        timestamp: e.eventDate,
      })),
      ...courtActions.map((c) => ({
        id: c.id,
        type: 'COURT_ACTION',
        title: c.actionType,
        description: c.description,
        timestamp: c.actionDate,
      })),
      ...documents.map((d) => ({
        id: d.id,
        type: 'DOCUMENT',
        title: `${d.documentType}: ${d.title}`,
        description: 'Document created',
        timestamp: d.createdAt,
      })),
      ...bailApps.map((b) => ({
        id: b.id,
        type: 'BAIL_APPLICATION',
        title: `Bail Application: ${b.applicantName}`,
        description: `Status: ${b.status}`,
        timestamp: b.createdAt,
      })),
      ...auditLogs.map((a) => ({
        id: a.id,
        type: 'AUDIT_LOG',
        title: a.action,
        description: a.details,
        timestamp: a.timestamp,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return {
      case: caseRecord,
      timeline,
    };
  }
}
