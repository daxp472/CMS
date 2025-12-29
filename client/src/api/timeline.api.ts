import apiClient from './axios';
import type { TimelineEvent, AuditLog, ApiResponse } from '../types/api.types';

export const timelineApi = {
  /**
   * GET /api/cases/:caseId/timeline
   * Get complete case timeline
   */
  getCaseTimeline: async (caseId: string): Promise<TimelineEvent[]> => {
    const response = await apiClient.get<ApiResponse<TimelineEvent[]>>(
      `/cases/${caseId}/timeline`
    );
    return response.data.data || [];
  },

  /**
   * GET /api/cases/:caseId/audit-logs
   * Get audit logs for case
   */
  getAuditLogs: async (caseId: string): Promise<AuditLog[]> => {
    const response = await apiClient.get<ApiResponse<AuditLog[]>>(
      `/cases/${caseId}/audit-logs`
    );
    return response.data.data || [];
  },
};
