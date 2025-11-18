import apiClient from "@/libs/interceptor";
import type { AxiosResponse } from "axios";

export interface DockerContainer {
  id: string;
  name: string;
  image: string;
  status: string; // running, exited, created
  ports: string[];
}
export interface DockerImage {
  id: string;
  repo_tags: string[];
  size: number;
}

export class DockerService {
  private readonly baseUrl = "/api/docker";

  /**
   * Lấy danh sách các Container trên Host/Cluster.
   */
  async getContainers(): Promise<DockerContainer[]> {
    try {
      const response: AxiosResponse<DockerContainer[]> = await apiClient.get(
        `${this.baseUrl}/containers`,
      );
      return response.data;
    } catch (error) {
      console.error("DockerService: Failed to fetch containers:", error);
      throw error;
    }
  }

  /**
   * Thực hiện hành động (start/stop/restart) lên một Container.
   * @param containerId ID của Container
   * @param action Hành động (start, stop, restart)
   */
  async controlContainer(
    containerId: string,
    action: "start" | "stop" | "restart",
  ): Promise<void> {
    try {
      // POST đến endpoint /containers/{id}/control với body chứa action
      await apiClient.post(
        `${this.baseUrl}/containers/${containerId}/control`,
        { action },
      );
    } catch (error) {
      console.error(
        `DockerService: Failed to ${action} container ${containerId}:`,
        error,
      );
      throw error;
    }
  }

  // --- Images Management ---

  /**
   * Lấy danh sách các Image trên Host/Cluster.
   */
  async getImages(): Promise<DockerImage[]> {
    try {
      const response: AxiosResponse<DockerImage[]> = await apiClient.get(
        `${this.baseUrl}/images`,
      );
      return response.data;
    } catch (error) {
      console.error("DockerService: Failed to fetch images:", error);
      throw error;
    }
  }

  /**
   * Xóa một Image theo ID.
   */
  async deleteImage(imageId: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/images/${imageId}`);
    } catch (error) {
      console.error(`DockerService: Failed to delete image ${imageId}:`, error);
      throw error;
    }
  }
}

export const dockerService = new DockerService();
export const getContainers = () => dockerService.getContainers();
export const getImages = () => dockerService.getImages();
export default dockerService;
