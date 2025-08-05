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
  filePath?: string;
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
  theme: Theme;
  searchFilters: SearchFilters;
  articles: ArticleMeta[];
  currentArticle: Article | null;
  loading: boolean;
  error: string | null;
}

// 主题相关类型定义
export type Theme = 'default' | 'sunny' | 'calm' | 'energetic' | 'cozy' | 'professional' | 'day' | 'night';

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  secondary: string;
  success: string;
  danger: string;
  warning: string;
  info: string;
  light: string;
  dark: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  backgroundLight: string;
  backgroundDark: string;
  borderColor: string;
  shadowColor: string;
}

export interface ThemeConfig {
  name: string;
  description: string;
  mood: string;
  colors: ThemeColors;
} 