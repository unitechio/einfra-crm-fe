import apiClient from "@/libs/interceptor";
import type { AxiosResponse } from "axios";

// ------------------------
// 1. Alert Service
// ------------------------
export interface Alert {
  id?: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "error" | "critical";
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export class AlertService {
  private readonly baseUrl = "/api/alerts";

  // Lấy danh sách Alerts
  async getAlerts(): Promise<Alert[]> {
    try {
      const response: AxiosResponse<Alert[]> = await apiClient.get(
        this.baseUrl,
      );
      return response.data;
    } catch (error) {
      console.error("AlertService: Failed to fetch alerts:", error);
      throw error;
    }
  }

  // Lấy chi tiết Alert theo ID
  async getAlertById(id: string): Promise<Alert> {
    try {
      const response: AxiosResponse<Alert> = await apiClient.get(
        `${this.baseUrl}/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error(`AlertService: Failed to fetch alert ${id}:`, error);
      throw error;
    }
  }

  // Tạo Alert mới
  async createAlert(alert: Alert): Promise<Alert> {
    try {
      const response: AxiosResponse<Alert> = await apiClient.post(
        this.baseUrl,
        alert,
      );
      return response.data;
    } catch (error) {
      console.error("AlertService: Failed to create alert:", error);
      throw error;
    }
  }

  // Cập nhật Alert
  async updateAlert(id: string, alert: Partial<Alert>): Promise<Alert> {
    try {
      const response: AxiosResponse<Alert> = await apiClient.put(
        `${this.baseUrl}/${id}`,
        alert,
      );
      return response.data;
    } catch (error) {
      console.error(`AlertService: Failed to update alert ${id}:`, error);
      throw error;
    }
  }

  // Xóa Alert
  async deleteAlert(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`AlertService: Failed to delete alert ${id}:`, error);
      throw error;
    }
  }
}

export const alertService = new AlertService();
export const getAlerts = () => alertService.getAlerts();
export const getAlertById = (id: string) => alertService.getAlertById(id);
export const createAlert = (alert: Alert) => alertService.createAlert(alert);
export const updateAlert = (id: string, alert: Partial<Alert>) =>
  alertService.updateAlert(id, alert);
export const deleteAlert = (id: string) => alertService.deleteAlert(id);

export default alertService;
