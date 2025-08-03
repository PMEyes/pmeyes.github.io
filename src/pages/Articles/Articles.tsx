import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { ArticleMeta, Language, SearchFilters } from '@/types';
import { languageService } from '@/services/languageService';
import { articleService } from '@/services/articleService';
import './Articles.scss';

interface ArticlesProps {
  contextValue: {
    language: Language;
    articles: ArticleMeta[];
    loading: boolean;
    error: string | null;
    onSearch: (filters: SearchFilters) => void;
    onClearSearch: () => void;
    onRetry: () => void;
  };
}

interface FolderNode {
  name: string;
  path: string;
  type: 'folder' | 'file';
  children?: FolderNode[];
  article?: ArticleMeta;
}

const Articles: React.FC<ArticlesProps> = ({ contextValue }) => {
  const { language, articles, loading, error, onSearch, onClearSearch, onRetry } = contextValue;
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [folderTree, setFolderTree] = useState<FolderNode[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadTags = () => {
      const tags = articleService.getAllTags();
      setAllTags(tags);
    };
    loadTags();
  }, []);

  useEffect(() => {
    const buildFolderTree = () => {
      // 使用动态生成的文件夹树数据
      const dynamicFolderTree = articleService.getFolderTree();
      setFolderTree(dynamicFolderTree.map(folder => ({
        name: folder.name,
        path: folder.path,
        type: 'folder' as const,
        children: folder.articles.map(article => ({
          name: article.title,
          path: `${folder.path}/${article.slug}`,
          type: 'file' as const,
          article: {
            id: article.id,
            title: article.title,
            excerpt: '',
            publishedAt: article.publishedAt,
            tags: article.tags,
            slug: article.slug,
            readingTime: article.readingTime,
            folder: folder.path
          }
        }))
      })));
    };
    
    buildFolderTree();
  }, [articles]);

  useEffect(() => {
    const tagParam = searchParams.get('tag');
    if (tagParam) {
      setSelectedTags([tagParam]);
      onSearch({ query: '', tags: [tagParam] });
    }
  }, [searchParams, onSearch]);

  const getLocaleDate = (dateString: string) => {
    const date = new Date(dateString);
    if (language === 'zh-CN') {
      return format(date, 'yyyy年MM月dd日', { locale: zhCN });
    }
    return format(date, 'MMM dd, yyyy', { locale: enUS });
  };

  const handleTagClick = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    onSearch({ query: '', tags: newTags });
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    setSelectedFolder('');
    onClearSearch();
  };

  const handleFolderClick = (folderPath: string) => {
    setSelectedFolder(folderPath);
    // 根据文件夹筛选文章
    if (folderPath) {
      const folderName = folderPath.split('/').pop() || folderPath;
      const filteredArticles = articles.filter(article => 
        article.folder === folderPath || article.folder?.includes(folderName)
      );
      // 这里可以调用父组件的筛选方法
      // 暂时直接使用本地筛选
    }
  };

  const toggleFolderExpansion = (folderPath: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolderTree = (nodes: FolderNode[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.path} className="folder-tree-item" style={{ paddingLeft: `${level * 20}px` }}>
        {node.type === 'folder' ? (
          <div className="folder-item">
            <div 
              className="folder-header"
              onClick={() => toggleFolderExpansion(node.path)}
            >
              <span className={`folder-icon ${expandedFolders.has(node.path) ? 'expanded' : ''}`}>
                ▶
              </span>
              <span className="folder-name">{node.name}</span>
              <span className="folder-count">({node.children?.length || 0})</span>
            </div>
            {expandedFolders.has(node.path) && node.children && (
              <div className="folder-children">
                {renderFolderTree(node.children, level + 1)}
              </div>
            )}
          </div>
        ) : (
          <div className="file-item">
            <Link 
              to={`/article/${node.article?.slug}`}
              className={`file-link ${selectedFolder === node.path ? 'active' : ''}`}
              onClick={() => handleFolderClick(node.path)}
            >
              {node.name}
            </Link>
          </div>
        )}
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>{languageService.getText('LOADING')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>{languageService.getText('ERROR_OCCURRED')}</h2>
        <p>{error}</p>
        <button className="button" onClick={onRetry}>
          {languageService.getText('RETRY')}
        </button>
      </div>
    );
  }

  return (
    <div className="articles-page">
      <div className="articles-layout">
        {/* 左侧文件夹树导航 */}
        <div className="articles-sidebar">
          <div className="sidebar-header">
            <h3>{languageService.getText('FOLDERS')}</h3>
          </div>
          <div className="folder-tree">
            {renderFolderTree(folderTree)}
          </div>
        </div>

        {/* 右侧文章列表 */}
        <div className="articles-main">
          <div className="articles-header">
            <h1>{languageService.getText('ARTICLES')}</h1>
            <p>
              {language === 'zh-CN' 
                ? '探索项目管理的深度见解和实践经验'
                : 'Explore deep insights and practical experiences in project management'
              }
            </p>
          </div>

          <div className="articles-filters">
            <div className="filter-section">
              <h3>{languageService.getText('TAGS')}</h3>
              <div className="filter-tags">
                {allTags.map((tag) => (
                  <span
                    key={tag}
                    className={`filter-tag ${selectedTags.includes(tag) ? 'active' : ''}`}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <button className="button button-secondary mt-2" onClick={handleClearFilters}>
                  {languageService.getText('CLEAR_SEARCH')}
                </button>
              )}
            </div>
          </div>

          <div className="articles-content">
            <div className="articles-stats">
              {language === 'zh-CN' 
                ? `找到 ${articles.length} 篇文章`
                : `Found ${articles.length} articles`
              }
            </div>

            {articles.length === 0 ? (
              <div className="no-articles">
                <h3>{languageService.getText('NO_ARTICLES_FOUND')}</h3>
                <p>
                  {language === 'zh-CN'
                    ? '没有找到符合条件的文章，请尝试调整搜索条件。'
                    : 'No articles found matching your criteria. Please try adjusting your search filters.'
                  }
                </p>
                <button className="button" onClick={handleClearFilters}>
                  {languageService.getText('CLEAR_SEARCH')}
                </button>
              </div>
            ) : (
              <div className="article-list">
                {articles.map((article) => (
                  <article key={article.id} className="article-item">
                    <div className="article-meta">
                      <time dateTime={article.publishedAt}>
                        {getLocaleDate(article.publishedAt)}
                      </time>
                      <span className="reading-time">
                        {article.readingTime} {language === 'zh-CN' ? '分钟' : 'min read'}
                      </span>
                    </div>
                    <h2 className="article-title">
                      <Link to={`/article/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h2>
                    <p className="article-excerpt">{article.excerpt}</p>
                    <div className="article-tags">
                      {article.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles; 