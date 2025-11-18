import apiClient from "@/libs/interceptor";
import type { AxiosResponse } from "axios";
import { Permission } from "./role.service";
import { create } from "zustand";

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

  /**
   * Tạo một Permission mới.
   * @param permission Thông tin Permission cần tạo
   */
  async createPermission(permission: Permission): Promise<Permission> {
    try {
      const response: AxiosResponse<Permission> = await apiClient.post(
        this.baseUrl,
        permission,
      );
      return response.data;
    } catch (error) {
      console.error(
        `PermissionService: Failed to create permission ${permission}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Cập nhật thông tin Permission.
   * @param permission Thông tin Permission cần cập nhật
   */
  async updatePermission(permission: Permission): Promise<Permission> {
    try {
      const response: AxiosResponse<Permission> = await apiClient.put(
        `${this.baseUrl}/${permission.id}`,
        permission,
      );
      return response.data;
    } catch (error) {
      console.error(
        `PermissionService: Failed to update permission ${permission}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Xóa một Permission.
   * @param permissionId ID của Permission cần xóa
   */
  async deletePermission(permissionId: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${permissionId}`);
    } catch (error) {
      console.error(
        `PermissionService: Failed to delete permission ${permissionId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Lấy thông tin Permission theo ID.
   * @param permissionId ID của Permission cần lấy thông tin
   */
  async getPermissionById(permissionId: string): Promise<Permission> {
    try {
      const response: AxiosResponse<Permission> = await apiClient.get(
        `${this.baseUrl}/${permissionId}`,
      );
      return response.data;
    } catch (error) {
      console.error(
        `PermissionService: Failed to get permission ${permissionId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Lấy danh sách Permission theo ID của Role.
   * @param roleId ID của Role cần lấy danh sách Permission
   */
  async getPermissionsByRoleId(roleId: string): Promise<Permission[]> {
    try {
      const response: AxiosResponse<Permission[]> = await apiClient.get(
        `${this.baseUrl}/role/${roleId}`,
      );
      return response.data;
    } catch (error) {
      console.error(
        `PermissionService: Failed to get permissions by role ${roleId}:`,
        error,
      );
      throw error;
    }
  }
}

export const permissionService = new PermissionService();

export const getPermissions = () => permissionService.getPermissions();
export const getPermissionsByResource = (resource: string) =>
  permissionService.getPermissionsByResource(resource);
export const getPermissionById = (permissionId: string) =>
  permissionService.getPermissionById(permissionId);
export const getPermissionsByRoleId = (roleId: string) =>
  permissionService.getPermissionsByRoleId(roleId);
export const createPermission = (permission: Permission) =>
  permissionService.createPermission(permission);
export const updatePermission = (permission: Permission) =>
  permissionService.updatePermission(permission);
export const deletePermission = (permissionId: string) =>
  permissionService.deletePermission(permissionId);

export default permissionService;
