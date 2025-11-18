import apiClient from "@/libs/interceptor";
import { AxiosResponse } from "axios";

export interface HarborProject {
  project_id: number;
  name: string;
  repo_count: number;
  creation_time: string;
  public: boolean; // Dự án công khai hay riêng tư
}

export interface HarborRepository {
  id: number;
  name: string; // Định dạng project_name/repo_name
  artifact_count: number;
  update_time: string;
}

export interface HarborArtifact {
  id: number;
  tags: { name: string }[];
  digest: string; // Mã định danh duy nhất của Image/Artifact
  push_time: string;
  size: number;
}

export class HarborService {
  private readonly baseUrl = "/harbor/api/v2.0";

  /**
   * Lấy danh sách các Project (Namespace) trên Harbor.
   */
  async getProjects(): Promise<HarborProject[]> {
    try {
      const response: AxiosResponse<HarborProject[]> = await apiClient.get(
        `${this.baseUrl}/projects`,
        {
          params: { _is_public: true, page_size: 100 },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Harbor: Failed to fetch projects:", error);
      throw error;
    }
  }

  /**
   * Lấy danh sách các Repository (Image) trong một Project cụ thể.
   * @param projectName Tên Project (ví dụ: 'my-app')
   */
  async getRepositories(projectName: string): Promise<HarborRepository[]> {
    try {
      const response: AxiosResponse<HarborRepository[]> = await apiClient.get(
        `${this.baseUrl}/projects/${projectName}/repositories`,
      );
      return response.data;
    } catch (error) {
      console.error(
        `Harbor: Failed to fetch repositories for project ${projectName}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Lấy danh sách các Artifact/Tags (Phiên bản Image) trong một Repository.
   * @param projectName Tên Project
   * @param repositoryName Tên Repository (ví dụ: 'nginx-web')
   */
  async getArtifacts(
    projectName: string,
    repositoryName: string,
  ): Promise<HarborArtifact[]> {
    try {
      const encodedRepoName = encodeURIComponent(repositoryName);

      const response: AxiosResponse<HarborArtifact[]> = await apiClient.get(
        `${this.baseUrl}/projects/${projectName}/repositories/${encodedRepoName}/artifacts`,
      );
      return response.data;
    } catch (error) {
      console.error(
        `Harbor: Failed to fetch artifacts for ${repositoryName}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Xóa một Artifact (Image) cụ thể bằng Digest (hoặc Tag).
   * Cực kỳ cẩn thận với hàm này.
   * @param projectName Tên Project
   * @param repositoryName Tên Repository
   * @param digest Mã Digest của Artifact (hoặc Tag)
   */
  async deleteArtifact(
    projectName: string,
    repositoryName: string,
    digest: string,
  ): Promise<void> {
    try {
      const encodedRepoName = encodeURIComponent(repositoryName);
      const encodedDigest = encodeURIComponent(digest);

      await apiClient.delete(
        `${this.baseUrl}/projects/${projectName}/repositories/${encodedRepoName}/artifacts/${encodedDigest}`,
      );
      console.log(`Harbor: Artifact ${digest} deleted successfully.`);
    } catch (error) {
      console.error(`Harbor: Failed to delete artifact ${digest}:`, error);
      throw error;
    }
  }

  /**
   * Tạo một Project mới.
   * @param name Tên Project mới
   * @param isPublic Đặt project ở chế độ công khai (true/false)
   */
  async createProject(name: string, isPublic: boolean = false): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/projects`, {
        project_name: name,
        public: isPublic,
        // Thêm các thuộc tính khác như storage_limit nếu cần
      });
    } catch (error) {
      console.error(`Harbor: Failed to create project ${name}:`, error);
      throw error;
    }
  }
}

export const harborService = new HarborService();

export const getProjects = () => harborService.getProjects();
export const getRepositories = (projectName: string) =>
  harborService.getRepositories(projectName);
export const getArtifacts = (projectName: string, repositoryName: string) =>
  harborService.getArtifacts(projectName, repositoryName);
export const deleteArtifact = (
  projectName: string,
  repositoryName: string,
  digest: string,
) => harborService.deleteArtifact(projectName, repositoryName, digest);

export default harborService;
