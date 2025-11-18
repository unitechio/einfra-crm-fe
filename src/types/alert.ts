export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  status: "active" | "resolved";
  createdAt: string;
  resolvedAt?: string;
  source?: string;
}

export interface AlertQueryParams {
  page?: number;
  limit?: number;
  severity?: "info" | "warning" | "critical";
  status?: "active" | "resolved";
  search?: string;
}
