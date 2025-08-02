export const SUPPORTED_LANGUAGES = ['zh-CN', 'en-US'] as const;
export const DEFAULT_LANGUAGE = 'zh-CN' as const;

export const ARTICLES_PER_PAGE = 10;
export const MAX_SEARCH_RESULTS = 50;

export const ROUTES = {
  HOME: '/',
  ARTICLES: '/articles',
  ARTICLE: '/article/:slug',
  ABOUT: '/about',
} as const;

export const API_ENDPOINTS = {
  ARTICLES: '/api/articles',
  ARTICLE: '/api/article/:slug',
} as const;

export const STORAGE_KEYS = {
  LANGUAGE: 'pmeyes_language',
  SEARCH_HISTORY: 'pmeyes_search_history',
} as const;

export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1200,
} as const;

export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
} as const; 