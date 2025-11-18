export interface HarborProject {
  id: number;
  name: string;
  public: boolean;
  ownerId: number;
  creationTime: string;
}

export interface HarborRepository {
  id: number;
  name: string;
  projectId: number;
  tagsCount: number;
  creationTime: string;
}

export interface HarborImageTag {
  name: string;
  size: number;
  digest: string;
  created: string;
  author?: string;
}
