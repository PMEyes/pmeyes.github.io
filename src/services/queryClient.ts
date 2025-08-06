import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 默认缓存时间：5分钟
      staleTime: 5 * 60 * 1000,
      // 默认垃圾回收时间：10分钟
      gcTime: 10 * 60 * 1000,
      // 重试次数
      retry: (failureCount, error: any) => {
        // 如果是 4xx 错误，不重试
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // 最多重试 3 次
        return failureCount < 3;
      },
      // 重试延迟
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // 在窗口重新获得焦点时重新获取数据
      refetchOnWindowFocus: false,
      // 在重新连接时重新获取数据
      refetchOnReconnect: true,
    },
    mutations: {
      // 变更失败时的重试次数
      retry: 1,
      // 变更失败时的重试延迟
      retryDelay: 1000,
    },
  },
});

// 查询键工厂
export const queryKeys = {
  // 文章相关
  articles: {
    all: ['articles'] as const,
    lists: () => [...queryKeys.articles.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.articles.lists(), filters] as const,
    details: () => [...queryKeys.articles.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.articles.details(), id] as const,
  },
  // 主题相关
  themes: {
    all: ['themes'] as const,
    current: () => [...queryKeys.themes.all, 'current'] as const,
    list: () => [...queryKeys.themes.all, 'list'] as const,
  },
  // 语言相关
  locales: {
    all: ['locales'] as const,
    current: () => [...queryKeys.locales.all, 'current'] as const,
    list: () => [...queryKeys.locales.all, 'list'] as const,
  },
} as const; 