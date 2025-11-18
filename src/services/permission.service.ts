import apiClient from "@/libs/interceptor";
import type { AxiosResponse } from "axios";
import { Permission } from "./role.service";

export class PermissionService {
  private readonly baseUrl = "/api/permissions";

  /**
   * Lấy danh sách tất cả các Permission có sẵn trong hệ thống.
   */
  async getPermissions(): Promise<Permission[]> {
    try {
      const response: AxiosResponse<Permission[]> = await apiClient.get(
        this.baseUrl,
      );
      return response.data;
    } catch (error) {
      console.error("PermissionService: Failed to fetch permissions:", error);
      throw error;
    }
  }

  /**
   * Lấy các Permissions theo Resource (Ví dụ: 'users', 'products').
   * @param resource Tên resource cần lọc
   */
  async getPermissionsByResource(resource: string): Promise<Permission[]> {
    try {
      const response: AxiosResponse<Permission[]> = await apiClient.get(
        this.baseUrl,
        {
          params: { resource },
        },
      );
      return response.data;
    } catch (error) {
      console.error(
        `PermissionService: Failed to fetch permissions for resource ${resource}:`,
        error,
      );
      throw error;
    }
  }
}

export const permissionService = new PermissionService();
export const getPermissions = () => permissionService.getPermissions();
export default permissionService;
