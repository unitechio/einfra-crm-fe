export interface ServerInfo {
  hostname: string;
  os_type: string;
  ip_address: string;
}

export interface NetworkStatus {
  target: string;
  is_reachable: boolean;
  latency_ms: number;
  error?: string;
}

export interface BackupStatus {
  status: "running" | "completed" | "failed" | "idle";
  last_run: string;
  message: string;
}

export interface SystemServiceStatus {
  name: string;
  status: "running" | "stopped" | "failed" | "unknown";
  uptime?: string;
}
