import { prisma } from '../../prisma/client';
import { ApiError } from '../../utils/ApiError';
import { BailStatus } from '@prisma/client';

export interface CreateBailApplicationRequest {
  applicantName: string;
  applicantRelation: string;
  grounds: string;
  suretyDetails?: string;
  amountProposed?: number;
}

export class BailService {
  /**
   * POST /api/cases/:caseId/bail-applications
   * Create bail application
   */
  async createBailApplication(
    caseId: string,
    data: CreateBailApplicationRequest,
    userId: string
  ) {
    // Verify case exists
    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!caseRecord) {
      throw ApiError.notFound('Case not found');
    }

    const bailApp = await prisma.$transaction(async (tx) => {
      const newBailApp = await tx.bailApplication.create({
        data: {
          caseId,
          applicantName: data.applicantName,
          applicantRelation: data.applicantRelation,
          grounds: data.grounds,
          suretyDetails: data.suretyDetails,
          amountProposed: data.amountProposed,
          status: BailStatus.PENDING,
          submittedById: userId,
        },
      });

      await tx.auditLog.create({
        data: {
          caseId,
          userId,
          action: 'BAIL_APPLICATION_SUBMITTED',
          entityType: 'BAIL_APPLICATION',
          entityId: newBailApp.id,
          details: `Bail application submitted for ${data.applicantName}`,
        },
      });

      return newBailApp;
    });

    return bailApp;
  }

  /**
   * GET /api/cases/:caseId/bail-applications
   * List bail applications
   */
  async getBailApplications(caseId: string) {
    const bailApps = await prisma.bailApplication.findMany({
      where: { caseId },
      include: {
        submittedBy: {
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

    return bailApps;
  }
}
