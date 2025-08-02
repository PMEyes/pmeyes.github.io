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

const Articles: React.FC<ArticlesProps> = ({ contextValue }) => {
  const { language, articles, loading, error, onSearch, onClearSearch, onRetry } = contextValue;
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    const loadTags = () => {
      const tags = articleService.getAllTags();
      setAllTags(tags);
    };
    loadTags();
  }, []);

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
    onClearSearch();
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
      <div className="container">
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
  );
};

export default Articles; 