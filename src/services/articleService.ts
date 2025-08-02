import { Article, ArticleMeta, SearchFilters } from '@/types';
import { MAX_SEARCH_RESULTS } from '@/constants';

// 模拟文章数据 - 实际项目中这些数据会从API获取
const mockArticles: Article[] = [
  {
    id: '1',
    title: '项目管理中的敏捷思维',
    excerpt: '探讨如何在传统项目管理中融入敏捷思维，提高项目交付效率和质量。',
    content: `# 项目管理中的敏捷思维

敏捷开发已经成为了现代软件开发的主流方法，但敏捷思维不仅仅适用于软件开发，它同样可以应用于各种类型的项目管理中。

## 什么是敏捷思维？

敏捷思维是一种以人为核心、迭代、递增的开发方法。它强调：

- **个体和互动** 高于流程和工具
- **工作的软件** 高于详尽的文档
- **客户合作** 高于合同谈判
- **响应变化** 高于遵循计划

## 在项目管理中的应用

### 1. 迭代式规划

传统的项目管理往往采用瀑布模型，一次性制定完整的项目计划。而敏捷思维则建议：

- 将项目分解为小的迭代周期
- 每个迭代都有可交付的成果
- 根据反馈不断调整后续计划

### 2. 持续改进

敏捷思维强调持续改进：

- 定期回顾会议
- 及时识别和解决问题
- 不断优化工作流程

### 3. 团队协作

- 跨功能团队
- 扁平化管理结构
- 开放透明的沟通

## 实施建议

1. **从小开始**：选择一个试点项目
2. **培训团队**：确保团队理解敏捷原则
3. **工具支持**：选择合适的项目管理工具
4. **持续学习**：鼓励团队学习和实践

敏捷思维不是一套固定的规则，而是一种思维方式。它需要根据具体情况进行调整和优化。`,
    publishedAt: '2024-01-15',
    tags: ['项目管理', '敏捷开发', '团队协作'],
    slug: 'agile-thinking-in-project-management',
    readingTime: 8,
  },
  {
    id: '2',
    title: '数字化转型中的项目管理挑战',
    excerpt: '分析企业在数字化转型过程中面临的项目管理挑战，以及相应的解决方案。',
    content: `# 数字化转型中的项目管理挑战

数字化转型已经成为企业发展的必然趋势，但在这个过程中，项目管理面临着前所未有的挑战。

## 主要挑战

### 1. 技术复杂性

数字化转型涉及多种技术的整合：
- 云计算
- 大数据
- 人工智能
- 物联网

### 2. 组织变革

数字化转型不仅仅是技术变革，更是组织变革：
- 流程再造
- 文化转变
- 技能提升

### 3. 风险管理

- 技术风险
- 业务风险
- 人员风险

## 解决方案

### 1. 分阶段实施

- 制定清晰的转型路线图
- 分阶段推进
- 及时评估和调整

### 2. 加强沟通

- 建立有效的沟通机制
- 确保各方理解和支持
- 及时处理冲突和问题

### 3. 人才培养

- 投资员工培训
- 引进专业人才
- 建立学习型组织

数字化转型是一个持续的过程，需要项目管理者的耐心和智慧。`,
    publishedAt: '2024-01-20',
    tags: ['数字化转型', '项目管理', '技术管理'],
    slug: 'project-management-challenges-in-digital-transformation',
    readingTime: 6,
  },
  {
    id: '3',
    title: '远程团队的项目管理最佳实践',
    excerpt: '分享在远程工作环境下，如何有效管理项目团队的经验和技巧。',
    content: `# 远程团队的项目管理最佳实践

随着远程工作的普及，如何有效管理远程团队成为了项目管理者面临的新挑战。

## 远程团队的特点

### 优势
- 人才池更大
- 成本更低
- 工作时间更灵活

### 挑战
- 沟通障碍
- 时区差异
- 文化差异
- 团队凝聚力

## 最佳实践

### 1. 建立清晰的沟通机制

- 选择合适的沟通工具
- 制定沟通规范
- 定期团队会议

### 2. 使用合适的项目管理工具

- 任务管理：Jira, Trello
- 文档协作：Notion, Confluence
- 视频会议：Zoom, Teams

### 3. 建立信任文化

- 结果导向
- 透明管理
- 及时反馈

### 4. 关注团队建设

- 虚拟团建活动
- 个人关怀
- 职业发展支持

## 成功案例

通过实施这些最佳实践，许多团队在远程环境下取得了成功。关键是要根据团队特点进行调整和优化。`,
    publishedAt: '2024-01-25',
    tags: ['远程工作', '团队管理', '项目管理'],
    slug: 'best-practices-for-remote-team-project-management',
    readingTime: 7,
  },
];

class ArticleService {
  private articles: Article[] = mockArticles;

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
    }));
  }
}

export const articleService = new ArticleService();
export default articleService; 