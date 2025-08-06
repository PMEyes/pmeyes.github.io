// HTTP 服务相关接口
export interface HttpServiceConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  code?: number;
}

// 文章相关接口
export interface Article {
  id: string;
  title: string;
  content: string;
  summary?: string;
  author?: string;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
  category?: string;
  path: string;
}

export interface ArticleListResponse {
  articles: Article[];
  total: number;
  categories: string[];
  tags: string[];
  folderTree: any[];
}

 