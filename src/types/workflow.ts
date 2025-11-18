export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: "pending" | "running" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
  steps?: WorkflowStep[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  startedAt?: string;
  finishedAt?: string;
  logs?: string;
}
