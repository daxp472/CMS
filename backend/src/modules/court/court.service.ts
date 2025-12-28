import { prisma } from '../../prisma/client';
import { ApiError } from '../../utils/ApiError';
import { CaseState, CourtActionType } from '@prisma/client';

export interface SubmitToCourtRequest {
  courtId: string;
  submissionNotes?: string;
}

export interface IntakeCaseRequest {
  acknowledgementNotes?: string;
}

export interface CourtActionRequest {
  actionType: CourtActionType;
  actionDate: string;
  description: string;
  orderDetails?: string;
  nextHearingDate?: string;
}

export class CourtService {
  /**
   * POST /api/cases/:caseId/submit-to-court
   * Submit case to court (SHO only)
   */
  async submitToCourt(
    caseId: string,
    data: SubmitToCourtRequest,
    userId: string,
    policeStationId: string
  ) {
    // Verify case belongs to police station
    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        currentState: true,
      },
    });

    if (!caseRecord) {
      throw ApiError.notFound('Case not found');
    }

    if (caseRecord.policeStationId !== policeStationId) {
      throw ApiError.forbidden('Access denied');
    }

    // Verify current state allows submission
    const allowedStates = [CaseState.UNDER_INVESTIGATION, CaseState.INVESTIGATION_COMPLETE];
    if (!allowedStates.includes(caseRecord.currentState!.state)) {
      throw ApiError.badRequest(
        `Cannot submit to court from state: ${caseRecord.currentState!.state}`
      );
    }

    // Verify court exists
    const court = await prisma.court.findUnique({
      where: { id: data.courtId },
    });

    if (!court) {
      throw ApiError.notFound('Court not found');
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update case
      const updated = await tx.case.update({
        where: { id: caseId },
        data: {
          courtId: data.courtId,
          submittedToCourtAt: new Date(),
          submissionNotes: data.submissionNotes,
        },
      });

      // Update case state
      await tx.currentCaseState.update({
        where: { caseId },
        data: {
          state: CaseState.SUBMITTED_TO_COURT,
          updatedById: userId,
        },
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          caseId,
          userId,
          action: 'CASE_SUBMITTED_TO_COURT',
          entityType: 'CASE',
          entityId: caseId,
          details: `Case submitted to court: ${court.name}`,
        },
      });

      return updated;
    });

    return result;
  }

  /**
   * POST /api/cases/:caseId/intake
   * Intake case (COURT_CLERK only)
   */
  async intakeCase(caseId: string, data: IntakeCaseRequest, userId: string, courtId: string) {
    // Verify case belongs to court
    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        currentState: true,
      },
    });

    if (!caseRecord) {
      throw ApiError.notFound('Case not found');
    }

    if (caseRecord.courtId !== courtId) {
      throw ApiError.forbidden('Access denied');
    }

    // Verify current state
    if (caseRecord.currentState!.state !== CaseState.SUBMITTED_TO_COURT) {
      throw ApiError.badRequest(`Cannot intake case from state: ${caseRecord.currentState!.state}`);
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update case
      const updated = await tx.case.update({
        where: { id: caseId },
        data: {
          acknowledgementNotes: data.acknowledgementNotes,
        },
      });

      // Update case state
      await tx.currentCaseState.update({
        where: { caseId },
        data: {
          state: CaseState.PENDING_COURT_INTAKE,
          updatedById: userId,
        },
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          caseId,
          userId,
          action: 'CASE_INTAKE',
          entityType: 'CASE',
          entityId: caseId,
          details: 'Case intake acknowledged',
        },
      });

      return updated;
    });

    return result;
  }

  /**
   * POST /api/cases/:caseId/court-actions
   * Create court action (JUDGE only)
   */
  async createCourtAction(
    caseId: string,
    data: CourtActionRequest,
    userId: string,
    courtId: string
  ) {
    // Verify case belongs to court
    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        currentState: true,
      },
    });

    if (!caseRecord) {
      throw ApiError.notFound('Case not found');
    }

    if (caseRecord.courtId !== courtId) {
      throw ApiError.forbidden('Access denied');
    }

    // Create court action and update state if needed
    const action = await prisma.$transaction(async (tx) => {
      const newAction = await tx.courtAction.create({
        data: {
          caseId,
          judgeId: userId,
          actionType: data.actionType,
          actionDate: new Date(data.actionDate),
          description: data.description,
          orderDetails: data.orderDetails,
          nextHearingDate: data.nextHearingDate ? new Date(data.nextHearingDate) : null,
        },
      });

      // Update case state based on action type
      let newState: CaseState | null = null;
      if (data.actionType === CourtActionType.HEARING_SCHEDULED) {
        newState = CaseState.UNDER_TRIAL;
      } else if (data.actionType === CourtActionType.JUDGMENT) {
        newState = CaseState.JUDGMENT_DELIVERED;
      } else if (data.actionType === CourtActionType.CASE_DISMISSED) {
        newState = CaseState.CLOSED;
      }

      if (newState) {
        await tx.currentCaseState.update({
          where: { caseId },
          data: {
            state: newState,
            updatedById: userId,
          },
        });
      }

      // Create audit log
      await tx.auditLog.create({
        data: {
          caseId,
          userId,
          action: 'COURT_ACTION_CREATED',
          entityType: 'COURT_ACTION',
          entityId: newAction.id,
          details: `Court action: ${data.actionType}`,
        },
      });

      return newAction;
    });

    return action;
  }

  /**
   * GET /api/cases/:caseId/court-actions
   * List court actions
   */
  async getCourtActions(caseId: string, courtId: string) {
    // Verify case belongs to court
    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
      select: { courtId: true },
    });

    if (!caseRecord) {
      throw ApiError.notFound('Case not found');
    }

    if (caseRecord.courtId !== courtId) {
      throw ApiError.forbidden('Access denied');
    }

    const actions = await prisma.courtAction.findMany({
      where: { caseId },
      include: {
        judge: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        actionDate: 'desc',
      },
    });

    return actions;
  }
}
