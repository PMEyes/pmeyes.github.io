export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  tags: string[];
  slug: string;
  readingTime: number;
  folder?: string;
}

export interface ArticleMeta {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  tags: string[];
  slug: string;
  readingTime: number;
  folder?: string;
}

export interface LocaleData {
  [key: string]: string;
}

export interface LocaleVariables {
  [key: string]: string | number;
}

export type Language = 'zh-CN' | 'en-US';

export interface SearchFilters {
  query: string;
  tags: string[];
  folder?: string;
}

export interface AppState {
  language: Language;
  searchFilters: SearchFilters;
  articles: ArticleMeta[];
  currentArticle: Article | null;
  loading: boolean;
  error: string | null;
} 