// src/types/user.ts

// ------------------------
// User Core
// ------------------------
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: RoleType;
  isActive: boolean;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ------------------------
// Role & Permissions
// ------------------------
export type RoleType = "ADMIN" | "USER" | "MANAGER" | "DEV";

export interface Role {
  id: string;
  name: RoleType;
  description?: string;
  permissions: Permission[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Permission {
  id: string;
  name: string;
  resource: string; // ví dụ: 'users', 'products'
  action: string; // ví dụ: 'create', 'update', 'delete', 'read'
  description?: string;
}

// ------------------------
// DTOs / API payloads
// ------------------------
export interface CreateUserDto {
  username: string;
  email: string;
  fullName: string;
  role: RoleType;
  password?: string; // nếu cần tạo mật khẩu mặc định
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  fullName?: string;
  role?: RoleType;
  isActive?: boolean;
  avatarUrl?: string;
}

// ------------------------
// Query / Filter Params
// ------------------------
export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: RoleType;
  isActive?: boolean;
}
