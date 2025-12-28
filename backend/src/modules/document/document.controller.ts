import { Request, Response } from 'express';
import { DocumentService } from './document.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';

const documentService = new DocumentService();

/**
 * POST /api/cases/:caseId/documents
 */
export const createDocument = asyncHandler(async (req: Request, res: Response) => {
  const { caseId } = req.params;
  const userId = req.user!.id;
  const userRole = req.user!.role;
  const organizationId = req.user!.organizationId;
  const organizationType = req.user!.organizationType;

  const document = await documentService.createDocument(
    caseId,
    req.body,
    userId,
    userRole,
    organizationId,
    organizationType
  );

  res.status(201).json({
    success: true,
    data: document,
  });
});

/**
 * GET /api/cases/:caseId/documents
 */
export const getDocuments = asyncHandler(async (req: Request, res: Response) => {
  const { caseId } = req.params;
  const userRole = req.user!.role;
  const organizationId = req.user!.organizationId;
  const organizationType = req.user!.organizationType;

  const documents = await documentService.getDocuments(
    caseId,
    userRole,
    organizationId,
    organizationType
  );

  res.status(200).json({
    success: true,
    data: documents,
  });
});

/**
 * POST /api/documents/:documentId/finalize
 */
export const finalizeDocument = asyncHandler(async (req: Request, res: Response) => {
  const { documentId } = req.params;
  const userId = req.user!.id;
  const organizationId = req.user!.organizationId;

  if (!organizationId) {
    throw ApiError.badRequest('User must be associated with a police station');
  }

  const document = await documentService.finalizeDocument(documentId, userId, organizationId);

  res.status(200).json({
    success: true,
    data: document,
  });
});
