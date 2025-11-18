import axiosClient from "@/libs/interceptor";

// 1. Định nghĩa các Interface (Types) cho dữ liệu
// (Tốt nhất nên tách ra file riêng như @/types/user.ts nếu dự án lớn)
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: "ADMIN" | "USER";
  isActive: boolean;
  avatarUrl?: string;
}

// Interface cho tham số tìm kiếm/phân trang
export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

// Interface cho dữ liệu tạo/sửa user
export interface CreateUserDto {
  username: string;
  email: string;
  fullName: string;
  role: string;
}

// 2. Các hàm Service
export const userService = {
  // Lấy danh sách user (có phân trang & filter)
  getAll: async (params?: UserQueryParams) => {
    const { data } = await axiosClient.get<User[]>("/users", { params });
    return data;
  },

  // Lấy chi tiết 1 user theo ID
  getById: async (id: string) => {
    const { data } = await axiosClient.get<User>(`/users/${id}`);
    return data;
  },

  // Lấy thông tin user đang đăng nhập (Profile)
  getMe: async () => {
    const { data } = await axiosClient.get<User>("/users/me");
    return data;
  },

  // Tạo user mới
  create: async (payload: CreateUserDto) => {
    const { data } = await axiosClient.post<User>("/users", payload);
    return data;
  },

  // Cập nhật user
  update: async (id: string, payload: Partial<CreateUserDto>) => {
    const { data } = await axiosClient.put<User>(`/users/${id}`, payload);
    return data;
  },

  // Xóa user
  delete: async (id: string) => {
    const { data } = await axiosClient.delete(`/users/${id}`);
    return data;
  },
};
