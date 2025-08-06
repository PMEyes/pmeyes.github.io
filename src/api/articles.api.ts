import type { ApiResponse, Article, ArticleListResponse } from '../types/api';

// 文章 API 接口
export const articlesApi = {
  // 获取文章目录和基本信息（只需要调用一次）
  getArticlesList: async (): Promise<ApiResponse<ArticleListResponse>> => {
    try {
      // 从本地数据文件获取文章目录信息
      const response = await fetch('/data/articles.json');
      const data = await response.json();
      
      // 提取所有标签
      const allTags = new Set<string>();
      data.articles?.forEach((article: any) => {
        article.tags?.forEach((tag: string) => allTags.add(tag));
      });

      // 提取所有分类（文件夹）
      const allCategories = new Set<string>();
      data.articles?.forEach((article: any) => {
        if (article.folder) {
          allCategories.add(article.folder);
        }
      });

      return {
        data: {
          articles: data.articles || [],
          total: data.articles?.length || 0,
          categories: Array.from(allCategories),
          tags: Array.from(allTags),
          folderTree: data.folderTree || [],
        },
        success: true,
        message: '获取文章列表成功',
      };
    } catch (error) {
      return {
        data: {
          articles: [],
          total: 0,
          categories: [],
          tags: [],
          folderTree: [],
        },
        success: false,
        message: error instanceof Error ? error.message : '获取文章列表失败',
      };
    }
  },

  // 获取文章详情内容
  getArticleContent: async (id: string): Promise<ApiResponse<Article>> => {
    try {
      // 首先从 articles.json 获取文章基本信息
      const listResponse = await fetch('/data/articles.json');
      const listData = await listResponse.json();
      const articleInfo = listData.articles?.find((article: any) => article.id === id);
      
      if (!articleInfo) {
        throw new Error('文章不存在');
      }

      // 从 articles-json 目录获取文章详细内容
      const contentResponse = await fetch(`/data/articles-json/${id}.json`);
      const contentData = await contentResponse.json();

      // 合并基本信息和详细内容
      const article: Article = {
        ...articleInfo,
        content: contentData.content || '',
        summary: contentData.summary || articleInfo.excerpt,
        author: contentData.author || '',
        createdAt: articleInfo.publishedAt,
        updatedAt: contentData.updatedAt,
        tags: articleInfo.tags || [],
        category: articleInfo.folder,
        path: articleInfo.filePath,
      };

      return {
        data: article,
        success: true,
        message: '获取文章详情成功',
      };
    } catch (error) {
      return {
        data: null as any,
        success: false,
        message: error instanceof Error ? error.message : '获取文章详情失败',
      };
    }
  },

  // 获取分类文章
  getArticlesByCategory: async (category: string): Promise<ApiResponse<Article[]>> => {
    try {
      const response = await fetch('/data/articles.json');
      const data = await response.json();
      const articles = data.articles?.filter((article: any) => 
        article.folder === category
      ) || [];

      return {
        data: articles,
        success: true,
        message: '获取分类文章成功',
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        message: error instanceof Error ? error.message : '获取分类文章失败',
      };
    }
  },

  // 获取标签文章
  getArticlesByTag: async (tag: string): Promise<ApiResponse<Article[]>> => {
    try {
      const response = await fetch('/data/articles.json');
      const data = await response.json();
      const articles = data.articles?.filter((article: any) => 
        article.tags?.includes(tag)
      ) || [];

      return {
        data: articles,
        success: true,
        message: '获取标签文章成功',
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        message: error instanceof Error ? error.message : '获取标签文章失败',
      };
    }
  },

  // 搜索文章
  searchArticles: async (keyword: string): Promise<ApiResponse<Article[]>> => {
    try {
      const response = await fetch('/data/articles.json');
      const data = await response.json();
      const articles = data.articles?.filter((article: any) => 
        article.title.toLowerCase().includes(keyword.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(keyword.toLowerCase())
      ) || [];

      return {
        data: articles,
        success: true,
        message: '搜索文章成功',
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        message: error instanceof Error ? error.message : '搜索文章失败',
      };
    }
  },
}; 