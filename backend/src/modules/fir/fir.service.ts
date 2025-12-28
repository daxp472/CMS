import { prisma } from '../../prisma/client';
import { ApiError } from '../../utils/ApiError';
import { CaseState, CaseCategory, DocumentType } from '@prisma/client';

export interface CreateFIRRequest {
  complainantName: string;
  complainantContact: string;
  complainantAddress?: string;
  incidentDate: string;
  incidentLocation: string;
  incidentDescription: string;
  sections?: string;
  category: CaseCategory;
}

export class FIRService {
  /**
   * Create a new FIR
   * Auto-creates Case and initial CaseState
   * Creates audit log entry
   * Returns: FIR with nested case_id
   */
  async createFIR(data: CreateFIRRequest, userId: string, policeStationId: string) {
    // Generate FIR number (format: PS_CODE/YEAR/SEQUENCE)
    const policeStation = await prisma.policeStation.findUnique({
      where: { id: policeStationId },
      select: { code: true },
    });

    if (!policeStation) {
      throw ApiError.notFound('Police station not found');
    }

    const year = new Date().getFullYear();
    const count = await prisma.fIR.count({
      where: {
        policeStationId,
        createdAt: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${year + 1}-01-01`),
        },
      },
    });

    const firNumber = `${policeStation.code}/${year}/${(count + 1).toString().padStart(4, '0')}`;

    // Create FIR with Case and initial state in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create Case first
      const newCase = await tx.case.create({
        data: {
          firId: '', // Will be updated after FIR creation
          policeStationId,
          category: data.category,
          sections: data.sections || '',
        },
      });

      // Generate case number
      const caseNumber = `CASE/${year}/${newCase.id.substring(0, 8).toUpperCase()}`;
      await tx.case.update({
        where: { id: newCase.id },
        data: { caseNumber },
      });

      // Create FIR
      const fir = await tx.fIR.create({
        data: {
          firNumber,
          caseId: newCase.id,
          policeStationId,
          complainantName: data.complainantName,
          complainantContact: data.complainantContact,
          complainantAddress: data.complainantAddress,
          incidentDate: new Date(data.incidentDate),
          incidentLocation: data.incidentLocation,
          incidentDescription: data.incidentDescription,
          sections: data.sections,
          category: data.category,
          registeredById: userId,
        },
        include: {
          case: true,
        },
      });

      // Update case with FIR ID
      await tx.case.update({
        where: { id: newCase.id },
        data: { firId: fir.id },
      });

      // Create initial case state
      await tx.currentCaseState.create({
        data: {
          caseId: newCase.id,
          state: CaseState.FIR_REGISTERED,
          updatedById: userId,
        },
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          caseId: newCase.id,
          userId,
          action: 'FIR_REGISTERED',
          entityType: 'FIR',
          entityId: fir.id,
          details: `FIR ${firNumber} registered`,
        },
      });

      return fir;
    });

    return result;
  }

  /**
   * Get FIR by ID with case details
   */
  async getFIRById(firId: string, userId: string, userRole: string, organizationId: string | null) {
    const fir = await prisma.fIR.findUnique({
      where: { id: firId },
      include: {
        case: {
          include: {
            currentState: true,
            assignedOfficer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        policeStation: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        registeredBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!fir) {
      throw ApiError.notFound('FIR not found');
    }

    // Access control: Only police from same station or court users can view
    if (userRole === 'POLICE' || userRole === 'SHO') {
      if (fir.policeStationId !== organizationId) {
        throw ApiError.forbidden('Access denied');
      }
    }

    return fir;
  }
}
