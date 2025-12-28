import { prisma } from '../../prisma/client';
import { ApiError } from '../../utils/ApiError';
import { DocumentType, CaseState } from '@prisma/client';

export interface CreateDocumentRequest {
  documentType: DocumentType;
  title: string;
  description?: string;
  filePath: string;
  metadata?: any;
}

export class DocumentService {
  /**
   * Verify case belongs to user's organization
   */
  private async verifyCaseAccess(
    caseId: string,
    userRole: string,
    organizationId: string | null,
    organizationType: string | null
  ) {
    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
      select: {
        policeStationId: true,
        courtId: true,
        currentState: {
          select: {
            state: true,
          },
        },
      },
    });

    if (!caseRecord) {
      throw ApiError.notFound('Case not found');
    }

    // Police can access their station's cases
    if ((userRole === 'POLICE' || userRole === 'SHO') && organizationType === 'POLICE_STATION') {
      if (caseRecord.policeStationId !== organizationId) {
        throw ApiError.forbidden('Access denied');
      }
    }

    // Court can access their cases
    if ((userRole === 'COURT_CLERK' || userRole === 'JUDGE') && organizationType === 'COURT') {
      if (caseRecord.courtId !== organizationId) {
        throw ApiError.forbidden('Access denied');
      }
    }

    return caseRecord;
  }

  /**
   * POST /api/cases/:caseId/documents
   * Create document (POLICE only)
   */
  async createDocument(
    caseId: string,
    data: CreateDocumentRequest,
    userId: string,
    userRole: string,
    organizationId: string | null,
    organizationType: string | null
  ) {
    const caseRecord = await this.verifyCaseAccess(caseId, userRole, organizationId, organizationType);

    // Check if documents are locked (submitted to court)
    const isLocked = [
      CaseState.SUBMITTED_TO_COURT,
      CaseState.PENDING_COURT_INTAKE,
      CaseState.UNDER_TRIAL,
      CaseState.JUDGMENT_DELIVERED,
      CaseState.CLOSED,
      CaseState.ARCHIVED,
    ].includes(caseRecord.currentState!.state);

    if (isLocked) {
      throw ApiError.forbidden('Cannot create documents - case has been submitted to court');
    }

    // Get latest version for this document type
    const latestDoc = await prisma.document.findFirst({
      where: {
        caseId,
        documentType: data.documentType,
      },
      orderBy: {
        version: 'desc',
      },
      select: {
        version: true,
      },
    });

    const version = (latestDoc?.version || 0) + 1;

    const document = await prisma.$transaction(async (tx) => {
      const newDoc = await tx.document.create({
        data: {
          caseId,
          documentType: data.documentType,
          title: data.title,
          description: data.description,
          filePath: data.filePath,
          version,
          metadata: data.metadata,
          createdById: userId,
        },
      });

      await tx.auditLog.create({
        data: {
          caseId,
          userId,
          action: 'DOCUMENT_CREATED',
          entityType: 'DOCUMENT',
          entityId: newDoc.id,
          details: `Document created: ${data.title} (v${version})`,
        },
      });

      return newDoc;
    });

    return document;
  }

  /**
   * GET /api/cases/:caseId/documents
   * List documents
   */
  async getDocuments(
    caseId: string,
    userRole: string,
    organizationId: string | null,
    organizationType: string | null
  ) {
    await this.verifyCaseAccess(caseId, userRole, organizationId, organizationType);

    const documents = await prisma.document.findMany({
      where: { caseId },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [{ documentType: 'asc' }, { version: 'desc' }],
    });

    return documents;
  }

  /**
   * POST /api/documents/:documentId/finalize
   * Finalize document (mark as final version, POLICE only)
   */
  async finalizeDocument(documentId: string, userId: string, policeStationId: string) {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        case: {
          select: {
            policeStationId: true,
            currentState: {
              select: {
                state: true,
              },
            },
          },
        },
      },
    });

    if (!document) {
      throw ApiError.notFound('Document not found');
    }

    if (document.case.policeStationId !== policeStationId) {
      throw ApiError.forbidden('Access denied');
    }

    if (document.isFinalized) {
      throw ApiError.badRequest('Document is already finalized');
    }

    // Check if case is locked
    const isLocked = [
      CaseState.SUBMITTED_TO_COURT,
      CaseState.PENDING_COURT_INTAKE,
      CaseState.UNDER_TRIAL,
      CaseState.JUDGMENT_DELIVERED,
      CaseState.CLOSED,
      CaseState.ARCHIVED,
    ].includes(document.case.currentState!.state);

    if (isLocked) {
      throw ApiError.forbidden('Cannot finalize documents - case has been submitted to court');
    }

    const updatedDoc = await prisma.$transaction(async (tx) => {
      const updated = await tx.document.update({
        where: { id: documentId },
        data: { isFinalized: true },
      });

      await tx.auditLog.create({
        data: {
          caseId: document.caseId,
          userId,
          action: 'DOCUMENT_FINALIZED',
          entityType: 'DOCUMENT',
          entityId: documentId,
          details: `Document finalized: ${document.title}`,
        },
      });

      return updated;
    });

    return updatedDoc;
  }
}
