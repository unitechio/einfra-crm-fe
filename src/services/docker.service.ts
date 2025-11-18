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

export interface DockerContainerStats {
  cpu_stats: {
    cpu_usage: {
      total_usage: number;
      percpu_usage: number[];
      usage_in_kernelmode: number;
      usage_in_usermode: number;
    };
    system_cpu_usage: number;
  };
  memory_stats: {
    usage: number;
    max_usage: number;
    stats: {
      cache: number;
      rss: number;
      pgfault: number;
      pgmajfault: number;
    };
  };
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

  async removeContainer(containerId: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/containers/${containerId}`);
    } catch (error) {
      console.error(
        `DockerService: Failed to remove container ${containerId}:`,
        error,
      );
      throw error;
    }
  }

  async inspectContainer(containerId: string): Promise<DockerContainer> {
    try {
      const response: AxiosResponse<DockerContainer> = await apiClient.get(
        `${this.baseUrl}/containers/${containerId}/json`,
      );
      return response.data;
    } catch (error) {
      console.error(
        `DockerService: Failed to inspect container ${containerId}:`,
        error,
      );
      throw error;
    }
  }

  async getContainerLogs(containerId: string): Promise<string> {
    try {
      const response: AxiosResponse<string> = await apiClient.get(
        `${this.baseUrl}/containers/${containerId}/logs`,
        {
          params: {
            stdout: true,
            stderr: true,
            timestamps: true,
            tail: 100,
            follow: false,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(
        `DockerService: Failed to get logs for container ${containerId}:`,
        error,
      );
      throw error;
    }
  }

  async getContainerStats(containerId: string): Promise<DockerContainerStats> {
    try {
      const response: AxiosResponse<DockerContainerStats> = await apiClient.get(
        `${this.baseUrl}/containers/${containerId}/stats`,
        {
          params: {
            stream: false,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(
        `DockerService: Failed to get stats for container ${containerId}:`,
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

  async pullImage(imageName: string): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/images/pull`, {
        fromImage: imageName,
      });
    } catch (error) {
      console.error(`DockerService: Failed to pull image ${imageName}:`, error);
      throw error;
    }
  }

  async pushImage(imageName: string): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/images/push`, {
        fromImage: imageName,
      });
    } catch (error) {
      console.error(`DockerService: Failed to push image ${imageName}:`, error);
      throw error;
    }
  }

  async tagImage(imageId: string, tag: string): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/images/${imageId}/tag`, {
        tag,
      });
    } catch (error) {
      console.error(
        `DockerService: Failed to tag image ${imageId} with tag ${tag}:`,
        error,
      );
      throw error;
    }
  }

  async pruneContainers(): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/containers/prune`);
    } catch (error) {
      console.error(`DockerService: Failed to prune containers:`, error);
      throw error;
    }
  }

  async pruneImages(): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/images/prune`);
    } catch (error) {
      console.error(`DockerService: Failed to prune images:`, error);
      throw error;
    }
  }
}

export const dockerService = new DockerService();

// --- Containers ---
export const getContainers = () => dockerService.getContainers();
export const controlContainer = (
  containerId: string,
  action: "start" | "stop" | "restart",
) => dockerService.controlContainer(containerId, action);
export const removeContainer = (containerId: string) =>
  dockerService.removeContainer(containerId);
export const inspectContainer = (containerId: string) =>
  dockerService.inspectContainer(containerId);
export const getContainerLogs = (containerId: string) =>
  dockerService.getContainerLogs(containerId);
export const getContainerStats = (containerId: string) =>
  dockerService.getContainerStats(containerId);
export const pruneContainers = () => dockerService.pruneContainers();

// --- Images ---
export const getImages = () => dockerService.getImages();
export const deleteImage = (imageId: string) =>
  dockerService.deleteImage(imageId);
export const pullImage = (imageName: string) =>
  dockerService.pullImage(imageName);
export const pushImage = (imageName: string) =>
  dockerService.pushImage(imageName);
export const tagImage = (imageId: string, tag: string) =>
  dockerService.tagImage(imageId, tag);
export const pruneImages = () => dockerService.pruneImages();

// --- Default export ---
export default dockerService;
