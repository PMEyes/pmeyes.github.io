import { Article, ArticleMeta, SearchFilters } from '@/types';
import { MAX_SEARCH_RESULTS } from '@/constants';

// 从 JSON 文件加载文章元数据
let articlesMeta: ArticleMeta[] = [];
let folderTree: any[] = [];
let isLoadingMeta = false;
let metaLoadPromise: Promise<void> | null = null;

  // 动态加载文章元数据
  async function loadArticlesMeta(): Promise<void> {
    // 如果正在加载，返回现有的 Promise
    if (isLoadingMeta && metaLoadPromise) {
      return metaLoadPromise;
    }

    // 如果已经加载完成，直接返回
    if (articlesMeta.length > 0 || folderTree.length > 0) {
      return;
    }

    // 开始加载
    isLoadingMeta = true;
    metaLoadPromise = _loadArticlesMeta();
    
    try {
      await metaLoadPromise;
    } finally {
      isLoadingMeta = false;
      metaLoadPromise = null;
    }
  }

  async function _loadArticlesMeta(): Promise<void> {
    try {
      const response = await fetch('/data/articles.json');
      if (!response.ok) {
        throw new Error(`Failed to load articles meta: ${response.statusText}`);
      }
    
      const data = await response.json();
      articlesMeta = data.articles || [];
      folderTree = data.folderTree || [];
    } catch (error) {
      console.error('加载文章元数据失败:', error);
      // 如果加载失败，使用空数组作为后备
      articlesMeta = [];
      folderTree = [];
    }
  }

class ArticleService {
  private initialized = false;
  private pendingRequests = new Map<string, Promise<Article | null>>();

  // 确保元数据已加载
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await loadArticlesMeta();
      this.initialized = true;
    }
  }

  async getAllArticles(): Promise<ArticleMeta[]> {
    await this.ensureInitialized();
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return articlesMeta;
  }

  async getArticleBySlug(slug: string): Promise<Article | null> {
    // 检查是否有正在进行的相同请求
    if (this.pendingRequests.has(slug)) {
      return this.pendingRequests.get(slug)!;
    }

    // 创建新的请求
    const requestPromise = this._getArticleBySlug(slug);
    this.pendingRequests.set(slug, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      // 请求完成后移除
      this.pendingRequests.delete(slug);
    }
  }

  private async _getArticleBySlug(slug: string): Promise<Article | null> {
    await this.ensureInitialized();
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const articleMeta = articlesMeta.find(a => a.slug === slug);
    if (!articleMeta) {
      return null;
    }

    try {
      // 从 JSON 文件加载文章内容
      const response = await fetch(`/data/articles-json/${slug}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load article: ${response.statusText}`);
      }
      
      const articleData = await response.json();
      
      return {
        ...articleMeta,
        content: articleData.content,
        // 使用 JSON 文件中的数据覆盖元数据
        title: articleData.title || articleMeta.title,
        excerpt: articleData.excerpt || articleMeta.excerpt,
        publishedAt: articleData.publishedAt || articleMeta.publishedAt,
        tags: articleData.tags || articleMeta.tags,
        readingTime: articleData.readingTime || articleMeta.readingTime,
      };
    } catch (error) {
      console.error('加载文章内容失败:', error);
      return null;
    }
  }

  async searchArticles(filters: SearchFilters): Promise<ArticleMeta[]> {
    await this.ensureInitialized();
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let results = articlesMeta;

    // 按查询词过滤
    if (filters.query.trim()) {
      const query = filters.query.toLowerCase();
      results = results.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query)
      );
    }

    // 按标签过滤
    if (filters.tags.length > 0) {
      results = results.filter(article =>
        filters.tags.some(tag => article.tags.includes(tag))
      );
    }

    // 按目录过滤（支持包含子文件夹）
    if (filters.folder) {
      results = results.filter(article => {
        const articleFolder = article.folder || '';
        // 精确匹配文件夹
        if (articleFolder === filters.folder) {
          return true;
        }
        // 检查是否是子文件夹
        if (articleFolder.startsWith(filters.folder + '/')) {
          return true;
        }
        return false;
      });
    }

    // 限制结果数量
    return results.slice(0, MAX_SEARCH_RESULTS);
  }

  async getArticlesByTag(tag: string): Promise<ArticleMeta[]> {
    await this.ensureInitialized();
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const results = articlesMeta.filter(article =>
      article.tags.includes(tag)
    );

    return results;
  }

  getAllTags(): string[] {
    const allTags = new Set<string>();
    articlesMeta.forEach(article => {
      article.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  }

  getRelatedArticles(currentSlug: string, limit: number = 3): ArticleMeta[] {
    const currentArticle = articlesMeta.find(a => a.slug === currentSlug);
    if (!currentArticle) return [];

    // 找到有相同标签的文章
    const related = articlesMeta
      .filter(article => 
        article.slug !== currentSlug &&
        article.tags.some(tag => currentArticle.tags.includes(tag))
      )
      .slice(0, limit);

    return related;
  }

  async getArticlesByFolder(folder: string): Promise<ArticleMeta[]> {
    await this.ensureInitialized();
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const results = articlesMeta.filter(article => article.folder === folder);

    return results;
  }

  getAllFolders(): string[] {
    const folders = new Set<string>();
    articlesMeta.forEach(article => {
      if (article.folder) {
        folders.add(article.folder);
      }
    });
    return Array.from(folders).sort();
  }

  // 获取文件夹树结构
  getFolderTree() {
    return folderTree;
  }
}

export const articleService = new ArticleService();
export default articleService; 