import { prisma } from '../../prisma/client';
import { ApiError } from '../../utils/ApiError';
import { CaseState, EvidenceType, WitnessType } from '@prisma/client';

export interface CreateInvestigationEventRequest {
  eventType: string;
  eventDate: string;
  location?: string;
  description: string;
  findings?: string;
}

export interface CreateEvidenceRequest {
  evidenceType: EvidenceType;
  description: string;
  location?: string;
  collectedDate: string;
  collectedBy?: string;
  storageLocation?: string;
  chainOfCustody?: string;
}

export interface CreateWitnessRequest {
  name: string;
  contactInfo?: string;
  address?: string;
  witnessType: WitnessType;
  statementSummary?: string;
}

export interface CreateAccusedRequest {
  name: string;
  age?: number;
  gender?: string;
  address?: string;
  contactInfo?: string;
  arrestDate?: string;
  arrestLocation?: string;
  chargesApplied?: string;
}

export class InvestigationService {
  /**
   * Verify case belongs to user's police station
   */
  private async verifyCaseAccess(caseId: string, policeStationId: string) {
    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
      select: { policeStationId: true },
    });

    if (!caseRecord) {
      throw ApiError.notFound('Case not found');
    }

    if (caseRecord.policeStationId !== policeStationId) {
      throw ApiError.forbidden('Access denied');
    }

    return caseRecord;
  }

  /**
   * POST /api/cases/:caseId/investigation-events
   * Create investigation event
   */
  async createInvestigationEvent(
    caseId: string,
    data: CreateInvestigationEventRequest,
    userId: string,
    policeStationId: string
  ) {
    await this.verifyCaseAccess(caseId, policeStationId);

    const event = await prisma.$transaction(async (tx) => {
      const newEvent = await tx.investigationEvent.create({
        data: {
          caseId,
          eventType: data.eventType,
          eventDate: new Date(data.eventDate),
          location: data.location,
          description: data.description,
          findings: data.findings,
          recordedById: userId,
        },
      });

      await tx.auditLog.create({
        data: {
          caseId,
          userId,
          action: 'INVESTIGATION_EVENT_CREATED',
          entityType: 'INVESTIGATION_EVENT',
          entityId: newEvent.id,
          details: `Investigation event created: ${data.eventType}`,
        },
      });

      return newEvent;
    });

    return event;
  }

  /**
   * GET /api/cases/:caseId/investigation-events
   * List investigation events
   */
  async getInvestigationEvents(caseId: string, policeStationId: string) {
    await this.verifyCaseAccess(caseId, policeStationId);

    const events = await prisma.investigationEvent.findMany({
      where: { caseId },
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
    });

    return events;
  }

  /**
   * POST /api/cases/:caseId/evidence
   * Create evidence
   */
  async createEvidence(
    caseId: string,
    data: CreateEvidenceRequest,
    userId: string,
    policeStationId: string
  ) {
    await this.verifyCaseAccess(caseId, policeStationId);

    const evidence = await prisma.$transaction(async (tx) => {
      const newEvidence = await tx.evidence.create({
        data: {
          caseId,
          evidenceType: data.evidenceType,
          description: data.description,
          location: data.location,
          collectedDate: new Date(data.collectedDate),
          collectedBy: data.collectedBy,
          storageLocation: data.storageLocation,
          chainOfCustody: data.chainOfCustody,
          recordedById: userId,
        },
      });

      await tx.auditLog.create({
        data: {
          caseId,
          userId,
          action: 'EVIDENCE_ADDED',
          entityType: 'EVIDENCE',
          entityId: newEvidence.id,
          details: `Evidence added: ${data.evidenceType}`,
        },
      });

      return newEvidence;
    });

    return evidence;
  }

  /**
   * GET /api/cases/:caseId/evidence
   * List evidence
   */
  async getEvidence(caseId: string, policeStationId: string) {
    await this.verifyCaseAccess(caseId, policeStationId);

    const evidence = await prisma.evidence.findMany({
      where: { caseId },
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
        collectedDate: 'desc',
      },
    });

    return evidence;
  }

  /**
   * POST /api/cases/:caseId/witnesses
   * Create witness
   */
  async createWitness(
    caseId: string,
    data: CreateWitnessRequest,
    userId: string,
    policeStationId: string
  ) {
    await this.verifyCaseAccess(caseId, policeStationId);

    const witness = await prisma.$transaction(async (tx) => {
      const newWitness = await tx.witness.create({
        data: {
          caseId,
          name: data.name,
          contactInfo: data.contactInfo,
          address: data.address,
          witnessType: data.witnessType,
          statementSummary: data.statementSummary,
          recordedById: userId,
        },
      });

      await tx.auditLog.create({
        data: {
          caseId,
          userId,
          action: 'WITNESS_ADDED',
          entityType: 'WITNESS',
          entityId: newWitness.id,
          details: `Witness added: ${data.name}`,
        },
      });

      return newWitness;
    });

    return witness;
  }

  /**
   * GET /api/cases/:caseId/witnesses
   * List witnesses
   */
  async getWitnesses(caseId: string, policeStationId: string) {
    await this.verifyCaseAccess(caseId, policeStationId);

    const witnesses = await prisma.witness.findMany({
      where: { caseId },
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
        createdAt: 'desc',
      },
    });

    return witnesses;
  }

  /**
   * POST /api/cases/:caseId/accused
   * Create accused
   */
  async createAccused(
    caseId: string,
    data: CreateAccusedRequest,
    userId: string,
    policeStationId: string
  ) {
    await this.verifyCaseAccess(caseId, policeStationId);

    const accused = await prisma.$transaction(async (tx) => {
      const newAccused = await tx.accused.create({
        data: {
          caseId,
          name: data.name,
          age: data.age,
          gender: data.gender,
          address: data.address,
          contactInfo: data.contactInfo,
          arrestDate: data.arrestDate ? new Date(data.arrestDate) : null,
          arrestLocation: data.arrestLocation,
          chargesApplied: data.chargesApplied,
          recordedById: userId,
        },
      });

      await tx.auditLog.create({
        data: {
          caseId,
          userId,
          action: 'ACCUSED_ADDED',
          entityType: 'ACCUSED',
          entityId: newAccused.id,
          details: `Accused added: ${data.name}`,
        },
      });

      return newAccused;
    });

    return accused;
  }

  /**
   * GET /api/cases/:caseId/accused
   * List accused
   */
  async getAccused(caseId: string, policeStationId: string) {
    await this.verifyCaseAccess(caseId, policeStationId);

    const accused = await prisma.accused.findMany({
      where: { caseId },
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
        createdAt: 'desc',
      },
    });

    return accused;
  }
}
