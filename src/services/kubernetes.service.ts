import apiClient from "@/libs/interceptor";

// --- 1. Types (có thể tách ra file riêng) ---
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

export class KubernetesService {
  private readonly baseUrl = "/api/kubernetes";

  // =================================================================
  // A. Namespaces
  // =================================================================

  async getNamespaces(): Promise<K8sNamespace[]> {
    const response = await apiClient.get(`${this.baseUrl}/namespaces`);
    return response.data;
  }

  async createNamespace(name: string): Promise<K8sNamespace> {
    const response = await apiClient.post(`${this.baseUrl}/namespaces`, {
      metadata: { name },
    });
    return response.data;
  }

  async deleteNamespace(name: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/namespaces/${name}`);
  }

  // =================================================================
  // B. Deployments
  // =================================================================

  async getDeployments(namespace: string): Promise<K8sDeployment[]> {
    const response = await apiClient.get(
      `${this.baseUrl}/namespaces/${namespace}/deployments`,
    );
    return response.data;
  }

  async scaleDeployment(
    namespace: string,
    deploymentName: string,
    replicas: number,
  ): Promise<K8sDeployment> {
    const response = await apiClient.put(
      `${this.baseUrl}/namespaces/${namespace}/deployments/${deploymentName}/scale`,
      { replicas },
    );
    return response.data;
  }

  async deleteDeployment(namespace: string, deploymentName: string) {
    await apiClient.delete(
      `${this.baseUrl}/namespaces/${namespace}/deployments/${deploymentName}`,
    );
  }

  // =================================================================
  // C. Pods
  // =================================================================

  async getPods(namespace: string): Promise<K8sPod[]> {
    const response = await apiClient.get(
      `${this.baseUrl}/namespaces/${namespace}/pods`,
    );
    return response.data;
  }

  async getPodLogs(namespace: string, podName: string): Promise<string> {
    const response = await apiClient.get(
      `${this.baseUrl}/namespaces/${namespace}/pods/${podName}/logs`,
    );
    return response.data;
  }

  /** Restart Pod (bằng cách delete -> K8s tự recreate). */
  async restartPod(namespace: string, podName: string): Promise<void> {
    await apiClient.delete(
      `${this.baseUrl}/namespaces/${namespace}/pods/${podName}/restart`,
    );
  }

  /** Exec (shell terminal) vào Pod */
  async execPod(
    namespace: string,
    podName: string,
    container: string,
    command: string[],
  ): Promise<string> {
    const response = await apiClient.post(
      `${this.baseUrl}/namespaces/${namespace}/pods/${podName}/exec`,
      { container, command },
    );
    return response.data;
  }

  // =================================================================
  // D. Services
  // =================================================================

  async getServices(namespace: string): Promise<K8sService[]> {
    const response = await apiClient.get(
      `${this.baseUrl}/namespaces/${namespace}/services`,
    );
    return response.data;
  }

  // =================================================================
  // E. Nodes
  // =================================================================

  async getNodes() {
    const response = await apiClient.get(`${this.baseUrl}/nodes`);
    return response.data;
  }

  async cordonNode(nodeName: string) {
    await apiClient.post(`${this.baseUrl}/nodes/${nodeName}/cordon`);
  }

  async uncordonNode(nodeName: string) {
    await apiClient.post(`${this.baseUrl}/nodes/${nodeName}/uncordon`);
  }

  async drainNode(nodeName: string) {
    await apiClient.post(`${this.baseUrl}/nodes/${nodeName}/drain`);
  }

  // =================================================================
  // F. Events
  // =================================================================

  async getEvents(namespace?: string) {
    const url = namespace
      ? `${this.baseUrl}/namespaces/${namespace}/events`
      : `${this.baseUrl}/events`;
    const response = await apiClient.get(url);
    return response.data;
  }

  // =================================================================
  // G. ConfigMaps
  // =================================================================

  async getConfigMaps(namespace: string) {
    const response = await apiClient.get(
      `${this.baseUrl}/namespaces/${namespace}/configmaps`,
    );
    return response.data;
  }

  async createConfigMap(namespace: string, data: Record<string, string>) {
    const response = await apiClient.post(
      `${this.baseUrl}/namespaces/${namespace}/configmaps`,
      { data },
    );
    return response.data;
  }

  async deleteConfigMap(namespace: string, name: string) {
    await apiClient.delete(
      `${this.baseUrl}/namespaces/${namespace}/configmaps/${name}`,
    );
  }

  // =================================================================
  // H. Secrets
  // =================================================================

  async getSecrets(namespace: string) {
    const response = await apiClient.get(
      `${this.baseUrl}/namespaces/${namespace}/secrets`,
    );
    return response.data;
  }

  async createSecret(
    namespace: string,
    type: string,
    data: Record<string, string>,
  ) {
    const response = await apiClient.post(
      `${this.baseUrl}/namespaces/${namespace}/secrets`,
      { type, data },
    );
    return response.data;
  }

  async deleteSecret(namespace: string, name: string) {
    await apiClient.delete(
      `${this.baseUrl}/namespaces/${namespace}/secrets/${name}`,
    );
  }

  // =================================================================
  // I. Ingress
  // =================================================================

  async getIngress(namespace: string) {
    const response = await apiClient.get(
      `${this.baseUrl}/namespaces/${namespace}/ingress`,
    );
    return response.data;
  }

  async deleteIngress(namespace: string, name: string) {
    await apiClient.delete(
      `${this.baseUrl}/namespaces/${namespace}/ingress/${name}`,
    );
  }

  // =================================================================
  // J. StatefulSets
  // =================================================================

  async getStatefulSets(namespace: string) {
    const response = await apiClient.get(
      `${this.baseUrl}/namespaces/${namespace}/statefulsets`,
    );
    return response.data;
  }

  async scaleStatefulSet(namespace: string, name: string, replicas: number) {
    const response = await apiClient.put(
      `${this.baseUrl}/namespaces/${namespace}/statefulsets/${name}/scale`,
      { replicas },
    );
    return response.data;
  }

  // =================================================================
  // K. DaemonSets
  // =================================================================

  async getDaemonSets(namespace: string) {
    const response = await apiClient.get(
      `${this.baseUrl}/namespaces/${namespace}/daemonsets`,
    );
    return response.data;
  }

  // =================================================================
  // L. Jobs & CronJobs
  // =================================================================

  async getJobs(namespace: string) {
    const response = await apiClient.get(
      `${this.baseUrl}/namespaces/${namespace}/jobs`,
    );
    return response.data;
  }

  async getCronJobs(namespace: string) {
    const response = await apiClient.get(
      `${this.baseUrl}/namespaces/${namespace}/cronjobs`,
    );
    return response.data;
  }

  // =================================================================
  // M. PersistentVolumeClaim (PVC)
  // =================================================================

  async getPVCs(namespace: string) {
    const response = await apiClient.get(
      `${this.baseUrl}/namespaces/${namespace}/pvcs`,
    );
    return response.data;
  }

  async deletePVC(namespace: string, name: string) {
    await apiClient.delete(
      `${this.baseUrl}/namespaces/${namespace}/pvcs/${name}`,
    );
  }

  // =================================================================
  // N. PersistentVolume (PV)
  // =================================================================

  async getPVs() {
    const response = await apiClient.get(`${this.baseUrl}/pvs`);
    return response.data;
  }

  // =================================================================
  // O. Describe Resource
  // =================================================================

  async describe(namespace: string | null, kind: string, name: string) {
    const response = await apiClient.get(`${this.baseUrl}/describe`, {
      params: { namespace, kind, name },
    });
    return response.data;
  }
}

// --------------------------------------------------------
export const kubernetesService = new KubernetesService();

export const getNamespaces = () => kubernetesService.getNamespaces();
export const getPods = (ns: string) => kubernetesService.getPods(ns);
export const getPodLogs = (ns: string, pod: string) =>
  kubernetesService.getPodLogs(ns, pod);
export const createNamespace = (name: string) =>
  kubernetesService.createNamespace(name);
export const getDeployments = (ns: string) =>
  kubernetesService.getDeployments(ns);
export const scaleDeployment = (
  ns: string,
  deploymentName: string,
  replicas: number,
) => kubernetesService.scaleDeployment(ns, deploymentName, replicas);

export default kubernetesService;
