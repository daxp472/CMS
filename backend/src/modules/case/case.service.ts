import { prisma } from '../../prisma/client';
import { ApiError } from '../../utils/ApiError';
import { Prisma } from '@prisma/client';

export interface CaseFilters {
  state?: string;
  category?: string;
  assignedOfficerId?: string;
  policeStationId?: string;
  courtId?: string;
}

export class CaseService {
  /**
   * Get cases assigned to current user (POLICE/SHO)
   */
  async getMyCases(userId: string, userRole: string, policeStationId: string | null) {
    if (userRole === 'POLICE' || userRole === 'SHO') {
      if (!policeStationId) {
        throw ApiError.badRequest('Police officer must be associated with a police station');
      }

      const cases = await prisma.case.findMany({
        where: {
          OR: [
            { assignedOfficerId: userId },
            { policeStationId, assignedOfficerId: null }, // Unassigned cases in same station
          ],
        },
        include: {
          fir: {
            select: {
              firNumber: true,
              complainantName: true,
              incidentDate: true,
              incidentLocation: true,
            },
          },
          currentState: true,
          assignedOfficer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          policeStation: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return cases;
    }

    throw ApiError.forbidden('Only police users can access this endpoint');
  }

  /**
   * Get all cases with filters (SHO/COURT)
   */
  async getAllCases(
    filters: CaseFilters,
    userRole: string,
    organizationId: string | null,
    organizationType: string | null
  ) {
    // Build where clause based on role
    const where: Prisma.CaseWhereInput = {};

    // SHO can only see cases from their police station
    if (userRole === 'SHO' && organizationType === 'POLICE_STATION') {
      where.policeStationId = organizationId!;
    }

    // Court users can only see cases assigned to their court
    if ((userRole === 'COURT_CLERK' || userRole === 'JUDGE') && organizationType === 'COURT') {
      where.courtId = organizationId!;
    }

    // Apply additional filters
    if (filters.state) {
      where.currentState = {
        state: filters.state as any,
      };
    }

    if (filters.category) {
      where.category = filters.category as any;
    }

    if (filters.assignedOfficerId) {
      where.assignedOfficerId = filters.assignedOfficerId;
    }

    const cases = await prisma.case.findMany({
      where,
      include: {
        fir: {
          select: {
            firNumber: true,
            complainantName: true,
            incidentDate: true,
            incidentLocation: true,
          },
        },
        currentState: true,
        assignedOfficer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        policeStation: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        court: {
          select: {
            id: true,
            name: true,
            code: true,
            courtType: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return cases;
  }

  /**
   * Get case by ID
   */
  async getCaseById(
    caseId: string,
    userId: string,
    userRole: string,
    organizationId: string | null,
    organizationType: string | null
  ) {
    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        fir: true,
        currentState: true,
        assignedOfficer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        policeStation: true,
        court: true,
        documents: {
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            version: 'desc',
          },
        },
        investigationEvents: {
          include: {
            recordedBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            eventDate: 'desc',
          },
        },
      },
    });

    if (!caseRecord) {
      throw ApiError.notFound('Case not found');
    }

    // Access control
    if (userRole === 'POLICE' || userRole === 'SHO') {
      if (organizationType === 'POLICE_STATION' && caseRecord.policeStationId !== organizationId) {
        throw ApiError.forbidden('Access denied');
      }
    }

    if (userRole === 'COURT_CLERK' || userRole === 'JUDGE') {
      if (organizationType === 'COURT' && caseRecord.courtId !== organizationId) {
        throw ApiError.forbidden('Access denied');
      }
    }

    return caseRecord;
  }

  /**
   * Assign case to officer (SHO only)
   */
  async assignCase(caseId: string, officerId: string, userId: string, policeStationId: string) {
    // Verify case belongs to same police station
    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
      select: { policeStationId: true, assignedOfficerId: true },
    });

    if (!caseRecord) {
      throw ApiError.notFound('Case not found');
    }

    if (caseRecord.policeStationId !== policeStationId) {
      throw ApiError.forbidden('Cannot assign cases from other police stations');
    }

    // Verify officer belongs to same police station
    const officer = await prisma.user.findUnique({
      where: { id: officerId },
      select: { organizationId: true, role: true, isActive: true },
    });

    if (!officer) {
      throw ApiError.notFound('Officer not found');
    }

    if (!officer.isActive) {
      throw ApiError.badRequest('Officer is inactive');
    }

    if (officer.role !== 'POLICE') {
      throw ApiError.badRequest('Can only assign to POLICE role users');
    }

    if (officer.organizationId !== policeStationId) {
      throw ApiError.badRequest('Officer must belong to same police station');
    }

    // Update case and create audit log
    const updatedCase = await prisma.$transaction(async (tx) => {
      const updated = await tx.case.update({
        where: { id: caseId },
        data: { assignedOfficerId: officerId },
        include: {
          assignedOfficer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      await tx.auditLog.create({
        data: {
          caseId,
          userId,
          action: 'CASE_ASSIGNED',
          entityType: 'CASE',
          entityId: caseId,
          details: `Case assigned to officer ${officer.organizationId}`,
        },
      });

      return updated;
    });

    return updatedCase;
  }
}
