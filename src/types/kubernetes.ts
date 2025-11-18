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
