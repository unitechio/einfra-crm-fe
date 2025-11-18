import axiosClient from "@/libs/interceptor";

// -----------------------------
// 1. Định nghĩa Types
// -----------------------------
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: "ADMIN" | "USER";
  isActive: boolean;
  avatarUrl?: string;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  fullName: string;
  role: string;
}

// -----------------------------
// 2. Định nghĩa Class UserService
// -----------------------------
export class UserService {
  private readonly baseUrl = "/users";

  async getAll(params?: UserQueryParams): Promise<User[]> {
    try {
      const response = await axiosClient.get<User[]>(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      console.error("UserService: Failed to fetch users:", error);
      throw error;
    }
  }

  async getById(id: string): Promise<User> {
    try {
      const response = await axiosClient.get<User>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`UserService: Failed to fetch user ${id}:`, error);
      throw error;
    }
  }

  async getMe(): Promise<User> {
    try {
      const response = await axiosClient.get<User>(`${this.baseUrl}/me`);
      return response.data;
    } catch (error) {
      console.error("UserService: Failed to fetch current user:", error);
      throw error;
    }
  }

  async create(payload: CreateUserDto): Promise<User> {
    try {
      const response = await axiosClient.post<User>(this.baseUrl, payload);
      return response.data;
    } catch (error) {
      console.error("UserService: Failed to create user:", error);
      throw error;
    }
  }

  async update(id: string, payload: Partial<CreateUserDto>): Promise<User> {
    try {
      const response = await axiosClient.put<User>(
        `${this.baseUrl}/${id}`,
        payload,
      );
      return response.data;
    } catch (error) {
      console.error(`UserService: Failed to update user ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await axiosClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`UserService: Failed to delete user ${id}:`, error);
      throw error;
    }
  }
}

// -----------------------------
// 3. Export singleton instance + helper functions
// -----------------------------
export const userService = new UserService();

export const getUsers = (params?: UserQueryParams) =>
  userService.getAll(params);
export const getUserById = (id: string) => userService.getById(id);
export const getCurrentUser = () => userService.getMe();
export const createUser = (payload: CreateUserDto) =>
  userService.create(payload);
export const updateUser = (id: string, payload: Partial<CreateUserDto>) =>
  userService.update(id, payload);
export const deleteUser = (id: string) => userService.delete(id);

export default userService;
