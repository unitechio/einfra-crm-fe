import apiClient from "@/libs/interceptor";
import type { AxiosResponse } from "axios";

// --- 1. Định nghĩa Types (Các tài nguyên K8s) ---
// (Các types này nên được import từ "@/types/kubernetes" trong thực tế)
export interface K8sMetadata {
  name: string;
  namespace?: string;
  creationTimestamp: string;
  labels: Record<string, string>;
}
export interface K8sNamespace {
  metadata: K8sMetadata;
  status: { phase: "Active" | "Terminating" };
}
export interface K8sDeployment {
  metadata: K8sMetadata;
  spec: { replicas: number };
  status: { availableReplicas: number };
}
export interface K8sServicePort {
  name?: string;
  protocol: "TCP" | "UDP" | "SCTP";
  port: number;
  targetPort: number | string;
  nodePort?: number;
}
export interface K8sContainerStatus {
  name: string;
  ready: boolean;
  restartCount: number;
  image: string;
  // Bổ sung các trường khác nếu cần
}
export interface K8sPod {
  metadata: K8sMetadata;
  status: {
    phase: string;
    containerStatuses?: K8sContainerStatus[];
  };
  spec: { nodeName: string };
}
export interface K8sService {
  metadata: K8sMetadata;
  spec: {
    type: string;
    clusterIP: string;
    ports: K8sServicePort[];
  };
}

// --- 2. Định nghĩa Class KubernetesService ---
export class KubernetesService {
  private readonly baseUrl = "/api/kubernetes"; // Giả định Backend trung gian quản lý K8s

  // ------------------------------------------------------------------
  // A. Namespaces Management
  // ------------------------------------------------------------------

  /**
   * Lấy danh sách tất cả các Namespaces (không gian tên) trong cụm.
   */
  async getNamespaces(): Promise<K8sNamespace[]> {
    try {
      const response: AxiosResponse<K8sNamespace[]> = await apiClient.get(
        `${this.baseUrl}/namespaces`,
      );
      return response.data;
    } catch (error) {
      console.error("K8sService: Failed to fetch namespaces:", error);
      throw error;
    }
  }

  /**
   * Tạo một Namespace mới.
   * @param name Tên của Namespace
   */
  async createNamespace(name: string): Promise<K8sNamespace> {
    try {
      const response: AxiosResponse<K8sNamespace> = await apiClient.post(
        `${this.baseUrl}/namespaces`,
        {
          metadata: { name },
        },
      );
      return response.data;
    } catch (error) {
      console.error(`K8sService: Failed to create namespace ${name}:`, error);
      throw error;
    }
  }

  /**
   * Xóa một Namespace. (Cảnh báo: Thao tác này xóa mọi thứ bên trong)
   * @param name Tên của Namespace
   */
  async deleteNamespace(name: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/namespaces/${name}`);
    } catch (error) {
      console.error(`K8sService: Failed to delete namespace ${name}:`, error);
      throw error;
    }
  }

  // ------------------------------------------------------------------
  // B. Deployments Management
  // ------------------------------------------------------------------

  /**
   * Lấy danh sách các Deployments trong một Namespace.
   * @param namespace Namespace đích
   */
  async getDeployments(namespace: string): Promise<K8sDeployment[]> {
    try {
      const response: AxiosResponse<K8sDeployment[]> = await apiClient.get(
        `${this.baseUrl}/namespaces/${namespace}/deployments`,
      );
      return response.data;
    } catch (error) {
      console.error(
        `K8sService: Failed to fetch deployments in ${namespace}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Cập nhật số lượng Replicas (Scale up/down) cho một Deployment.
   * @param namespace Namespace đích
   * @param deploymentName Tên Deployment
   * @param replicas Số lượng Replicas mới
   */
  async scaleDeployment(
    namespace: string,
    deploymentName: string,
    replicas: number,
  ): Promise<K8sDeployment> {
    try {
      const response: AxiosResponse<K8sDeployment> = await apiClient.put(
        `${this.baseUrl}/namespaces/${namespace}/deployments/${deploymentName}/scale`,
        { replicas },
      );
      return response.data;
    } catch (error) {
      console.error(
        `K8sService: Failed to scale deployment ${deploymentName}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Xóa một Deployment.
   * @param namespace Namespace đích
   * @param deploymentName Tên Deployment
   */
  async deleteDeployment(
    namespace: string,
    deploymentName: string,
  ): Promise<void> {
    try {
      await apiClient.delete(
        `${this.baseUrl}/namespaces/${namespace}/deployments/${deploymentName}`,
      );
    } catch (error) {
      console.error(
        `K8sService: Failed to delete deployment ${deploymentName}:`,
        error,
      );
      throw error;
    }
  }

  // ------------------------------------------------------------------
  // C. Pods Management
  // ------------------------------------------------------------------

  /**
   * Lấy danh sách các Pods trong một Namespace.
   * @param namespace Namespace đích
   */
  async getPods(namespace: string): Promise<K8sPod[]> {
    try {
      const response: AxiosResponse<K8sPod[]> = await apiClient.get(
        `${this.baseUrl}/namespaces/${namespace}/pods`,
      );
      return response.data;
    } catch (error) {
      console.error(`K8sService: Failed to fetch pods in ${namespace}:`, error);
      throw error;
    }
  }

  /**
   * Lấy Logs (nhật ký) của một Pod.
   * @param namespace Namespace đích
   * @param podName Tên Pod
   */
  async getPodLogs(namespace: string, podName: string): Promise<string> {
    try {
      // Giả sử API trả về chuỗi text logs
      const response: AxiosResponse<string> = await apiClient.get(
        `${this.baseUrl}/namespaces/${namespace}/pods/${podName}/logs`,
      );
      return response.data;
    } catch (error) {
      console.error(
        `K8sService: Failed to fetch logs for pod ${podName}:`,
        error,
      );
      throw error;
    }
  }

  // ------------------------------------------------------------------
  // D. Services Management
  // ------------------------------------------------------------------

  /**
   * Lấy danh sách các Services (External, ClusterIP) trong một Namespace.
   * @param namespace Namespace đích
   */
  async getServices(namespace: string): Promise<K8sService[]> {
    try {
      const response: AxiosResponse<K8sService[]> = await apiClient.get(
        `${this.baseUrl}/namespaces/${namespace}/services`,
      );
      return response.data;
    } catch (error) {
      console.error(
        `K8sService: Failed to fetch services in ${namespace}:`,
        error,
      );
      throw error;
    }
  }
}

// --- 3. Export Singleton Instance và Functions ---
export const kubernetesService = new KubernetesService();

// Export các hàm riêng lẻ (Chọn các hàm phổ biến nhất)
export const getNamespaces = () => kubernetesService.getNamespaces();
export const createNamespace = (name: string) =>
  kubernetesService.createNamespace(name);
export const getDeployments = (namespace: string) =>
  kubernetesService.getDeployments(namespace);
export const scaleDeployment = (
  namespace: string,
  deploymentName: string,
  replicas: number,
) => kubernetesService.scaleDeployment(namespace, deploymentName, replicas);
export const getPods = (namespace: string) =>
  kubernetesService.getPods(namespace);
export const getPodLogs = (namespace: string, podName: string) =>
  kubernetesService.getPodLogs(namespace, podName);

export default kubernetesService;
