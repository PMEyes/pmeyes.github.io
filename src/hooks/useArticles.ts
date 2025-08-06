import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../services/queryClient';
import { articlesApi } from '../api/articles.api';

// 获取文章列表和目录信息（只需要调用一次）
export const useArticlesList = () => {
  return useQuery({
    queryKey: queryKeys.articles.lists(),
    queryFn: articlesApi.getArticlesList,
    staleTime: 10 * 60 * 1000, // 10分钟缓存，因为文章列表变化不频繁
  });
};

// 获取文章详情内容
export const useArticleContent = (id: string) => {
  return useQuery({
    queryKey: queryKeys.articles.detail(id),
    queryFn: () => articlesApi.getArticleContent(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });
};

// 获取分类文章
export const useArticlesByCategory = (category: string) => {
  return useQuery({
    queryKey: [...queryKeys.articles.lists(), 'category', category],
    queryFn: () => articlesApi.getArticlesByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });
};

// 获取标签文章
export const useArticlesByTag = (tag: string) => {
  return useQuery({
    queryKey: [...queryKeys.articles.lists(), 'tag', tag],
    queryFn: () => articlesApi.getArticlesByTag(tag),
    enabled: !!tag,
    staleTime: 5 * 60 * 1000,
  });
};

// 搜索文章
export const useSearchArticles = (keyword: string) => {
  return useQuery({
    queryKey: [...queryKeys.articles.lists(), 'search', keyword],
    queryFn: () => articlesApi.searchArticles(keyword),
    enabled: !!keyword && keyword.length > 0,
    staleTime: 2 * 60 * 1000, // 2分钟缓存
  });
}; 