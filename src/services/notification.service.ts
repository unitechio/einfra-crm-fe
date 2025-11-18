import apiClient from "@/libs/interceptor";
import type { AxiosResponse } from "axios";

// --- 1. Định nghĩa Types (Giả định) ---
export interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  timestamp: string;
  link?: string;
}

// --- 2. Định nghĩa Class NotificationService ---
export class NotificationService {
  private readonly baseUrl = "/notifications";

  /**
   * Lấy danh sách tất cả các thông báo của người dùng hiện tại.
   */
  async getNotifications(): Promise<Notification[]> {
    try {
      const response: AxiosResponse<Notification[]> = await apiClient.get(
        this.baseUrl,
      );
      return response.data;
    } catch (error) {
      console.error(
        "NotificationService: Failed to fetch notifications:",
        error,
      );
      throw error;
    }
  }

  /**
   * Đánh dấu một thông báo cụ thể là đã đọc.
   * @param id ID của thông báo
   */
  async markAsRead(id: string): Promise<Notification> {
    try {
      // Endpoint thường trả về thông báo đã được cập nhật
      const response: AxiosResponse<Notification> = await apiClient.put(
        `${this.baseUrl}/${id}/read`,
      );
      return response.data;
    } catch (error) {
      console.error(
        `NotificationService: Failed to mark notification ${id} as read:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Đánh dấu tất cả các thông báo chưa đọc là đã đọc.
   */
  async markAllAsRead(): Promise<{ success: boolean; count: number }> {
    try {
      // Endpoint thường trả về trạng thái thành công hoặc số lượng đã đọc
      const response: AxiosResponse<{ success: boolean; count: number }> =
        await apiClient.post(`${this.baseUrl}/mark-all-read`);
      return response.data;
    } catch (error) {
      console.error(
        "NotificationService: Failed to mark all notifications as read:",
        error,
      );
      throw error;
    }
  }

  /**
   * Xóa một thông báo cụ thể.
   * (Bổ sung thêm chức năng thường gặp)
   * @param id ID của thông báo
   */
  async deleteNotification(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(
        `NotificationService: Failed to delete notification ${id}:`,
        error,
      );
      throw error;
    }
  }
}

export const notificationService = new NotificationService();

export const getNotifications = () => notificationService.getNotifications();
export const markAsRead = (id: string) => notificationService.markAsRead(id);
export const markAllAsRead = () => notificationService.markAllAsRead();
export const deleteNotification = (id: string) =>
  notificationService.deleteNotification(id);

export default notificationService;
