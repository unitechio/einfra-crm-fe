import apiClient from "@/libs/interceptor";
import type { AxiosResponse } from "axios";

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}
export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}
export interface CreateRoleDto {
  name: string;
  description?: string;
  permissionIds: string[];
}

export class RoleService {
  private readonly baseUrl = "/api/roles";

  /**
   * Lấy danh sách tất cả các Role.
   */
  async getRoles(): Promise<Role[]> {
    try {
      const response: AxiosResponse<Role[]> = await apiClient.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error("RoleService: Failed to fetch roles:", error);
      throw error;
    }
  }

  /**
   * Lấy chi tiết một Role theo ID.
   */
  async getRoleById(id: string): Promise<Role> {
    try {
      const response: AxiosResponse<Role> = await apiClient.get(
        `${this.baseUrl}/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error(`RoleService: Failed to fetch role with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Tạo một Role mới với các Permissions được gán.
   */
  async createRole(data: CreateRoleDto): Promise<Role> {
    try {
      const response: AxiosResponse<Role> = await apiClient.post(
        this.baseUrl,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("RoleService: Failed to create role:", error);
      throw error;
    }
  }

  /**
   * Cập nhật thông tin và danh sách Permissions của một Role.
   */
  async updateRole(id: string, data: Partial<CreateRoleDto>): Promise<Role> {
    try {
      const response: AxiosResponse<Role> = await apiClient.put(
        `${this.baseUrl}/${id}`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error(`RoleService: Failed to update role with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Xóa một Role theo ID.
   */
  async deleteRole(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`RoleService: Failed to delete role with ID ${id}:`, error);
      throw error;
    }
  }
}

export const roleService = new RoleService();
export const getRoles = () => roleService.getRoles();
export const createRole = (data: CreateRoleDto) => roleService.createRole(data);
export default roleService;
