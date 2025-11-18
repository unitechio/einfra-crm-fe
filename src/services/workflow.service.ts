import apiClient from "@/libs/interceptor";
import type { AxiosResponse } from "axios";

export interface Workflow {
  id?: string;
  name: string;
  description?: string;
  steps: string[]; // danh sách tên các bước
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export class WorkflowService {
  private readonly baseUrl = "/api/workflows";

  /**
   * Lấy danh sách Workflow
   * @returns danh sách Workflow
   */
  async getWorkflows(): Promise<Workflow[]> {
    try {
      const response: AxiosResponse<Workflow[]> = await apiClient.get(
        this.baseUrl,
      );
      return response.data;
    } catch (error) {
      console.error("WorkflowService: Failed to fetch workflows:", error);
      throw error;
    }
  }

  /**
   * Lấy chi tiết Workflow theo ID
   * @param id ID của Workflow
   * @returns chi tiết Workflow
   */
  async getWorkflowById(id: string): Promise<Workflow> {
    try {
      const response: AxiosResponse<Workflow> = await apiClient.get(
        `${this.baseUrl}/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error(`WorkflowService: Failed to fetch workflow ${id}:`, error);
      throw error;
    }
  }

  /**
   * Tạo Workflow mới
   * @param workflow Workflow mới
   * @returns Workflow đã tạo
   */
  async createWorkflow(workflow: Workflow): Promise<Workflow> {
    try {
      const response: AxiosResponse<Workflow> = await apiClient.post(
        this.baseUrl,
        workflow,
      );
      return response.data;
    } catch (error) {
      console.error("WorkflowService: Failed to create workflow:", error);
      throw error;
    }
  }

  /**
   * Cập nhật Workflow
   * @param id ID của Workflow
   * @param workflow Workflow mới
   * @returns Workflow đã cập nhật
   */
  async updateWorkflow(
    id: string,
    workflow: Partial<Workflow>,
  ): Promise<Workflow> {
    try {
      const response: AxiosResponse<Workflow> = await apiClient.put(
        `${this.baseUrl}/${id}`,
        workflow,
      );
      return response.data;
    } catch (error) {
      console.error(`WorkflowService: Failed to update workflow ${id}:`, error);
      throw error;
    }
  }

  /**
   * Xóa Workflow
   * @param id ID của Workflow
   * @returns void
   */
  async deleteWorkflow(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`WorkflowService: Failed to delete workflow ${id}:`, error);
      throw error;
    }
  }

  /**
   * Kích hoạt / Deactivate Workflow
   * @param id ID của Workflow
   * @param isActive Trạng thái mới của Workflow
   * @returns Workflow đã cập nhật
   */
  async toggleWorkflowStatus(id: string, isActive: boolean): Promise<Workflow> {
    try {
      const response: AxiosResponse<Workflow> = await apiClient.post(
        `${this.baseUrl}/${id}/toggle`,
        { isActive },
      );
      return response.data;
    } catch (error) {
      console.error(
        `WorkflowService: Failed to toggle workflow ${id} status:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Thực thi toàn bộ Workflow
   * @param id ID của Workflow
   * @returns void
   */
  async executeWorkflow(id: string): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/${id}/execute`);
    } catch (error) {
      console.error(
        `WorkflowService: Failed to execute workflow ${id}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Thực thi một Step cụ thể trong Workflow
   * @param id ID của Workflow
   * @param stepName Tên Step cần thực thi
   * @returns void
   */
  async runStep(id: string, stepName: string): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/${id}/steps/${stepName}/run`);
    } catch (error) {
      console.error(
        `WorkflowService: Failed to run step ${stepName} in workflow ${id}:`,
        error,
      );
      throw error;
    }
  }
}

export const workflowService = new WorkflowService();

export const getWorkflows = () => workflowService.getWorkflows();
export const getWorkflowById = (id: string) =>
  workflowService.getWorkflowById(id);
export const createWorkflow = (workflow: Workflow) =>
  workflowService.createWorkflow(workflow);
export const updateWorkflow = (id: string, workflow: Partial<Workflow>) =>
  workflowService.updateWorkflow(id, workflow);
export const deleteWorkflow = (id: string) =>
  workflowService.deleteWorkflow(id);
export const toggleWorkflowStatus = (id: string, isActive: boolean) =>
  workflowService.toggleWorkflowStatus(id, isActive);
export const executeWorkflow = (id: string) =>
  workflowService.executeWorkflow(id);
export const runWorkflowStep = (id: string, stepName: string) =>
  workflowService.runStep(id, stepName);

export default workflowService;
