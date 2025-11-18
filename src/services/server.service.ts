import apiClient from "@/libs/interceptor";
import type { AxiosResponse } from "axios";

// --- 1. Định nghĩa Types (Bổ sung) ---
export interface ServerInfo {
  hostname: string;
  os_type: string;
  ip_address: string;
}
// Tái sử dụng/Bổ sung các types cần thiết
export interface NetworkStatus {
  target: string;
  is_reachable: boolean;
  latency_ms: number;
  error?: string;
}
export interface BackupStatus {
  status: "running" | "completed" | "failed" | "idle";
  last_run: string; // ISO string
  message: string;
}
export interface SystemServiceStatus {
  name: string;
  status: "running" | "stopped" | "failed" | "unknown";
  uptime?: string;
}

// --- 2. Định nghĩa Class ServerService ---
export class ServerService {
  private readonly baseUrl = "/api/server";

  // --- A. Network Checks ---

  /**
   * Kiểm tra độ trễ (latency) đến một địa chỉ IP hoặc Hostname.
   * @param serverId ID máy chủ nguồn
   * @param target IP hoặc Hostname đích
   */
  async checkPing(serverId: string, target: string): Promise<NetworkStatus> {
    try {
      const response: AxiosResponse<NetworkStatus> = await apiClient.post(
        `${this.baseUrl}/${serverId}/network/ping`,
        { target },
      );
      return response.data;
    } catch (error) {
      console.error(
        `ServerService: Ping check failed from ${serverId} to ${target}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Kiểm tra trạng thái kết nối (open/closed) đến một Port cụ thể.
   * @param serverId ID máy chủ nguồn
   * @param target IP hoặc Hostname đích
   * @param port Số cổng cần kiểm tra
   */
  async checkPortStatus(
    serverId: string,
    target: string,
    port: number,
  ): Promise<NetworkStatus> {
    try {
      const response: AxiosResponse<NetworkStatus> = await apiClient.post(
        `${this.baseUrl}/${serverId}/network/port`,
        { target, port },
      );
      return response.data;
    } catch (error) {
      console.error(
        `ServerService: Port check failed from ${serverId} to ${target}:${port}:`,
        error,
      );
      throw error;
    }
  }

  // --- B. Backup Operations ---

  /**
   * Bắt đầu một tiến trình sao lưu (backup) theo cấu hình.
   * @param serverId ID máy chủ
   * @param config Tên cấu hình hoặc loại backup (ví dụ: 'full', 'database')
   */
  async startBackup(serverId: string, config: string): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/${serverId}/backup/start`, {
        config,
      });
    } catch (error) {
      console.error(
        `ServerService: Failed to start backup on ${serverId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Lấy trạng thái hiện tại của tiến trình sao lưu gần nhất.
   * @param serverId ID máy chủ
   */
  async getBackupStatus(serverId: string): Promise<BackupStatus> {
    try {
      const response: AxiosResponse<BackupStatus> = await apiClient.get(
        `${this.baseUrl}/${serverId}/backup/status`,
      );
      return response.data;
    } catch (error) {
      console.error(
        `ServerService: Failed to get backup status for ${serverId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Phục hồi dữ liệu từ một bản sao lưu cụ thể (rất nguy hiểm, cần quyền cao).
   * @param serverId ID máy chủ
   * @param backupId ID bản sao lưu cần restore
   */
  async restoreBackup(serverId: string, backupId: string): Promise<void> {
    try {
      console.warn(
        `Sending restore command for backup ${backupId} on server ${serverId}.`,
      );
      await apiClient.post(`${this.baseUrl}/${serverId}/backup/restore`, {
        backupId,
      });
    } catch (error) {
      console.error(
        `ServerService: Failed to restore backup ${backupId}:`,
        error,
      );
      throw error;
    }
  }

  // --- C. Service Management (System Services) ---

  /**
   * Lấy trạng thái hiện tại của một Service hệ thống (ví dụ: nginx, sshd).
   * @param serverId ID máy chủ
   * @param serviceName Tên Service hệ thống
   */
  async getServiceStatus(
    serverId: string,
    serviceName: string,
  ): Promise<SystemServiceStatus> {
    try {
      const response: AxiosResponse<SystemServiceStatus> = await apiClient.get(
        `${this.baseUrl}/${serverId}/system/service/${serviceName}/status`,
      );
      return response.data;
    } catch (error) {
      console.error(
        `ServerService: Failed to get status for service ${serviceName} on ${serverId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Bắt đầu một Service hệ thống.
   */
  async startService(serverId: string, serviceName: string): Promise<void> {
    try {
      await apiClient.post(
        `${this.baseUrl}/${serverId}/system/service/${serviceName}/start`,
      );
    } catch (error) {
      console.error(
        `ServerService: Failed to start service ${serviceName} on ${serverId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Dừng (Stop) một Service hệ thống.
   */
  async stopService(serverId: string, serviceName: string): Promise<void> {
    try {
      await apiClient.post(
        `${this.baseUrl}/${serverId}/system/service/${serviceName}/stop`,
      );
    } catch (error) {
      console.error(
        `ServerService: Failed to stop service ${serviceName} on ${serverId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Khởi động lại (Restart) một Service hệ thống.
   */
  async restartService(serverId: string, serviceName: string): Promise<void> {
    try {
      await apiClient.post(
        `${this.baseUrl}/${serverId}/system/service/${serviceName}/restart`,
      );
    } catch (error) {
      console.error(
        `ServerService: Failed to restart service ${serviceName} on ${serverId}:`,
        error,
      );
      throw error;
    }
  }

  // --- D. Core Lifecycle (Giữ lại các hàm cũ) ---

  async getServerInfo(serverId: string): Promise<ServerInfo> {
    /* ... code cũ ... */ throw new Error("Not implemented");
  }
  // ... (Bạn nên giữ lại hoặc thay thế các hàm này bằng code hoàn chỉnh trước đó)
}

export const serverService = new ServerService();

export const checkPing = (serverId: string, target: string) =>
  serverService.checkPing(serverId, target);
export const startBackup = (serverId: string, config: string) =>
  serverService.startBackup(serverId, config);
export const getServiceStatus = (serverId: string, serviceName: string) =>
  serverService.getServiceStatus(serverId, serviceName);
export const restartService = (serverId: string, serviceName: string) =>
  serverService.restartService(serverId, serviceName);
// ... (Thêm các hàm export còn lại)

export default serverService;
