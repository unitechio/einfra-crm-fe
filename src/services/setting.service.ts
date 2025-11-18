import apiClient from "@/libs/interceptor";
import type { AxiosResponse } from "axios";

// --- 1. Types ---
export interface SystemSettings {
  id?: string; // Nếu settings được lưu riêng cho từng user hoặc global
  font?: string; // font-family, ví dụ "Roboto"
  themeMode?: "light" | "dark" | "system"; // theme mode
  language?: string; // "en", "vi", ...
  createdAt?: string;
  updatedAt?: string;
}

// --- 2. Service Class ---
export class SettingService {
  private readonly baseUrl = "/api/settings";

  // --- Get all settings ---
  async getSettings(): Promise<SystemSettings> {
    try {
      const response: AxiosResponse<SystemSettings> = await apiClient.get(
        `${this.baseUrl}`,
      );
      return response.data;
    } catch (error) {
      console.error("SettingService: Failed to fetch settings:", error);
      throw error;
    }
  }

  // --- Get setting by ID (optional, if multi-user) ---
  async getSettingById(id: string): Promise<SystemSettings> {
    try {
      const response: AxiosResponse<SystemSettings> = await apiClient.get(
        `${this.baseUrl}/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error(`SettingService: Failed to fetch setting ${id}:`, error);
      throw error;
    }
  }

  // --- Create / Initialize settings ---
  async createSetting(payload: SystemSettings): Promise<SystemSettings> {
    try {
      const response: AxiosResponse<SystemSettings> = await apiClient.post(
        this.baseUrl,
        payload,
      );
      return response.data;
    } catch (error) {
      console.error("SettingService: Failed to create setting:", error);
      throw error;
    }
  }

  // --- Update settings ---
  async updateSetting(
    payload: Partial<SystemSettings> & { id?: string },
  ): Promise<SystemSettings> {
    try {
      const url = payload.id ? `${this.baseUrl}/${payload.id}` : this.baseUrl;
      const response: AxiosResponse<SystemSettings> = await apiClient.put(
        url,
        payload,
      );
      return response.data;
    } catch (error) {
      console.error("SettingService: Failed to update setting:", error);
      throw error;
    }
  }

  // --- Delete setting by ID ---
  async deleteSetting(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`SettingService: Failed to delete setting ${id}:`, error);
      throw error;
    }
  }

  // --- Reset to default settings ---
  async resetSettings(): Promise<SystemSettings> {
    try {
      const response: AxiosResponse<SystemSettings> = await apiClient.post(
        `${this.baseUrl}/reset`,
      );
      return response.data;
    } catch (error) {
      console.error("SettingService: Failed to reset settings:", error);
      throw error;
    }
  }
}

// --- 3. Singleton + Export Helpers ---
export const settingService = new SettingService();

// Helper functions
export const getSettings = () => settingService.getSettings();
export const getSettingById = (id: string) => settingService.getSettingById(id);
export const createSetting = (payload: SystemSettings) =>
  settingService.createSetting(payload);
export const updateSetting = (
  payload: Partial<SystemSettings> & { id?: string },
) => settingService.updateSetting(payload);
export const deleteSetting = (id: string) => settingService.deleteSetting(id);
export const resetSettings = () => settingService.resetSettings();

export default settingService;
