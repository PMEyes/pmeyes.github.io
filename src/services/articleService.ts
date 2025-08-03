import { Article, ArticleMeta, SearchFilters } from '@/types';
import { MAX_SEARCH_RESULTS } from '@/constants';
import articlesData from '@/data/articles.json';

// 从动态生成的数据文件中获取文章数据
const { articles: dynamicArticles, folderTree } = articlesData;

class ArticleService {
  private articles: Article[] = dynamicArticles;

  async getAllArticles(): Promise<ArticleMeta[]> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return this.articles.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      publishedAt: article.publishedAt,
      tags: article.tags,
      slug: article.slug,
      readingTime: article.readingTime,
      folder: article.folder,
    }));
  }

  async getArticleBySlug(slug: string): Promise<Article | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const article = this.articles.find(a => a.slug === slug);
    return article || null;
  }

  async searchArticles(filters: SearchFilters): Promise<ArticleMeta[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let results = this.articles;

    // 按查询词过滤
    if (filters.query.trim()) {
      const query = filters.query.toLowerCase();
      results = results.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query)
      );
    }

    // 按标签过滤
    if (filters.tags.length > 0) {
      results = results.filter(article =>
        filters.tags.some(tag => article.tags.includes(tag))
      );
    }

    // 转换为ArticleMeta格式
    const articleMetas = results.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      publishedAt: article.publishedAt,
      tags: article.tags,
      slug: article.slug,
      readingTime: article.readingTime,
      folder: article.folder,
    }));

    // 限制结果数量
    return articleMetas.slice(0, MAX_SEARCH_RESULTS);
  }

  async getArticlesByTag(tag: string): Promise<ArticleMeta[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const results = this.articles.filter(article =>
      article.tags.includes(tag)
    );

    return results.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      publishedAt: article.publishedAt,
      tags: article.tags,
      slug: article.slug,
      readingTime: article.readingTime,
      folder: article.folder,
    }));
  }

  getAllTags(): string[] {
    const allTags = new Set<string>();
    this.articles.forEach(article => {
      article.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  }

  getRelatedArticles(currentSlug: string, limit: number = 3): ArticleMeta[] {
    const currentArticle = this.articles.find(a => a.slug === currentSlug);
    if (!currentArticle) return [];

    // 找到有相同标签的文章
    const related = this.articles
      .filter(article => 
        article.slug !== currentSlug &&
        article.tags.some(tag => currentArticle.tags.includes(tag))
      )
      .slice(0, limit);

    return related.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      publishedAt: article.publishedAt,
      tags: article.tags,
      slug: article.slug,
      readingTime: article.readingTime,
      folder: article.folder,
    }));
  }

  async getArticlesByFolder(folder: string): Promise<ArticleMeta[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const results = this.articles.filter(article => article.folder === folder);

    return results.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      publishedAt: article.publishedAt,
      tags: article.tags,
      slug: article.slug,
      readingTime: article.readingTime,
      folder: article.folder,
    }));
  }

  getAllFolders(): string[] {
    const folders = new Set<string>();
    this.articles.forEach(article => {
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