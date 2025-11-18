export interface DockerContainer {
  id: string;
  name: string;
  image: string;
  status: "running" | "exited" | "created";
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
