import apiClient from "@/libs/interceptor";
import type {
  AuditLog,
  AuditLogFilters,
  AuditLogResponse,
  AuditStatistics,
} from "@/types/audit";
import { AxiosResponse } from "axios";

// --- Helper Function ---
const buildQueryParams = (filters: Record<string, unknown>): string => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });
  return params.toString();
};

// --- Audit Service Class ---
export class AuditService {
  private readonly baseUrl = "/api/audit";

  /**
   * Lấy danh sách nhật ký Audit (có thể kèm theo bộ lọc).
   */
  async getAuditLogs(filters: AuditLogFilters = {}): Promise<AuditLogResponse> {
    try {
      const queryString = buildQueryParams(filters);
      const response: AxiosResponse<AuditLogResponse> = await apiClient.get(
        `${this.baseUrl}/logs?${queryString}`,
      );
      return response.data;
    } catch (error) {
      console.error("Audit: Failed to fetch audit logs:", error);
      throw error;
    }
  }

  /**
   * Lấy chi tiết một nhật ký Audit theo ID.
   */
  async getAuditLogById(id: string): Promise<AuditLog> {
    try {
      const response: AxiosResponse<AuditLog> = await apiClient.get(
        `${this.baseUrl}/logs/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Audit: Failed to fetch audit log with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Lấy các chỉ số thống kê của Audit Logs (có thể kèm theo bộ lọc).
   */
  async getAuditStatistics(
    filters: Partial<AuditLogFilters> = {},
  ): Promise<AuditStatistics> {
    try {
      const queryString = buildQueryParams(filters);
      const response: AxiosResponse<AuditStatistics> = await apiClient.get(
        `${this.baseUrl}/statistics?${queryString}`,
      );
      return response.data;
    } catch (error) {
      console.error("Audit: Failed to fetch audit statistics:", error);
      throw error;
    }
  }

  /**
   * Xuất Audit Logs ra file (ví dụ: CSV). Trả về Blob.
   */
  async exportAuditLogs(filters: AuditLogFilters = {}): Promise<Blob> {
    try {
      const queryString = buildQueryParams(filters);
      const response: AxiosResponse<Blob> = await apiClient.get(
        `${this.baseUrl}/export?${queryString}`,
        {
          responseType: "blob", // Quan trọng: Yêu cầu Axios trả về dữ liệu nhị phân
        },
      );
      return response.data;
    } catch (error) {
      console.error("Audit: Failed to export audit logs:", error);
      throw error;
    }
  }

  /**
   * Lấy danh sách Audit Logs theo ID theo dõi (Trace ID).
   */
  async getAuditLogsByTraceId(traceId: string): Promise<AuditLog[]> {
    try {
      const response: AxiosResponse<AuditLog[]> = await apiClient.get(
        `${this.baseUrl}/trace/${traceId}`,
      );
      return response.data;
    } catch (error) {
      console.error(
        `Audit: Failed to fetch logs by Trace ID ${traceId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Lấy danh sách Audit Logs theo ID người dùng.
   */
  async getAuditLogsByUser(
    userId: string,
    filters: Partial<AuditLogFilters> = {},
  ): Promise<AuditLogResponse> {
    try {
      const queryString = buildQueryParams(filters);
      const response: AxiosResponse<AuditLogResponse> = await apiClient.get(
        `${this.baseUrl}/users/${userId}?${queryString}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Audit: Failed to fetch logs by User ID ${userId}:`, error);
      throw error;
    }
  }
}

export const auditService = new AuditService();

export const getAuditLogs = (filters: AuditLogFilters = {}) =>
  auditService.getAuditLogs(filters);

export const getAuditLogById = (id: string) => auditService.getAuditLogById(id);

export const getAuditStatistics = (filters: Partial<AuditLogFilters> = {}) =>
  auditService.getAuditStatistics(filters);

export const exportAuditLogs = (filters: AuditLogFilters = {}) =>
  auditService.exportAuditLogs(filters);

export const getAuditLogsByTraceId = (traceId: string) =>
  auditService.getAuditLogsByTraceId(traceId);

export const getAuditLogsByUser = (
  userId: string,
  filters: Partial<AuditLogFilters> = {},
) => auditService.getAuditLogsByUser(userId, filters);

export default auditService;
