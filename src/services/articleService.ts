import { Article, ArticleMeta, SearchFilters } from '@/types';
import { MAX_SEARCH_RESULTS } from '@/constants';

// 从 JSON 文件加载文章元数据
let articlesMeta: ArticleMeta[] = [];
let folderTree: any[] = [];

  // 动态加载文章元数据
  async function loadArticlesMeta(): Promise<void> {
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
    await this.ensureInitialized();
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const articleMeta = articlesMeta.find(a => a.slug === slug);
    if (!articleMeta) {
      return null;
    }

    try {
      // 动态加载文章内容
      const response = await fetch(`/articles/${articleMeta.filePath}`);
      if (!response.ok) {
        throw new Error(`Failed to load article: ${response.statusText}`);
      }
      
      const content = await response.text();
      
      // 解析 Markdown front matter
      const { data, content: markdownContent } = this.parseFrontMatter(content);
      
      return {
        ...articleMeta,
        content: markdownContent,
        // 使用 front matter 中的数据覆盖元数据
        title: data.title || articleMeta.title,
        excerpt: data.excerpt || articleMeta.excerpt,
        publishedAt: data.publishedAt || articleMeta.publishedAt,
        tags: data.tags || articleMeta.tags,
        readingTime: data.readingTime || articleMeta.readingTime,
      };
    } catch (error) {
      console.error('加载文章内容失败:', error);
      return null;
    }
  }

  // 解析 Markdown front matter
  private parseFrontMatter(content: string): { data: any; content: string } {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);
    
    if (match) {
      const frontMatter = match[1];
      const markdownContent = match[2];
      
      // 简单的 YAML 解析（仅支持基本格式）
      const data: any = {};
      const lines = frontMatter.split('\n');
      
      for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).trim();
          let value = line.substring(colonIndex + 1).trim();
          
          // 处理数组格式
          if (value.startsWith('[') && value.endsWith(']')) {
            const arrayValue = value.slice(1, -1).split(',').map(item => item.trim().replace(/"/g, ''));
            data[key] = arrayValue;
          }
          // 处理字符串格式
          else if (value.startsWith('"') && value.endsWith('"')) {
            data[key] = value.slice(1, -1);
          }
          else {
            data[key] = value;
          }
        }
      }
      
      return { data, content: markdownContent };
    }
    
    return { data: {}, content };
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