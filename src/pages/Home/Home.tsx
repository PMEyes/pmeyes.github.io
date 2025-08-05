import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { ArticleMeta, Language, Theme } from '@/types';
import { languageService } from '@/services/languageService';
import { articleService } from '@/services/articleService';
import './Home.scss';

interface HomeProps {
  contextValue: {
    language: Language;
    theme: Theme;
    articles: ArticleMeta[];
    loading: boolean;
    error: string | null;
    onRetry: () => void;
  };
}

const Home: React.FC<HomeProps> = ({ contextValue }) => {
  const { language, articles, loading, error, onRetry } = contextValue;
  const [tags, setTags] = React.useState<string[]>([]);

  React.useEffect(() => {
    const loadTags = async () => {
      const allTags = articleService.getAllTags();
      setTags(allTags);
    };
    loadTags();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = language === 'zh-CN' ? zhCN : enUS;
    return format(date, 'yyyy年MM月dd日', { locale });
  };

  const getLocaleDate = (dateString: string) => {
    if (language === 'zh-CN') {
      return formatDate(dateString);
    }
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy', { locale: enUS });
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

  const latestArticles = articles.slice(0, 6);

  return (
    <div className="home">
      {/* 英雄区域 */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            {languageService.getText('SITE_TITLE')}
          </h1>
          <p className="hero-subtitle">
            {languageService.getText('SITE_DESCRIPTION')}
          </p>
          <div className="hero-actions">
            <Link to="/blogs" className="button">
              {languageService.getText('ARTICLES')}
            </Link>
            <Link to="/about" className="button button-outline">
              {languageService.getText('ABOUT')}
            </Link>
          </div>
        </div>
      </section>

      {/* 最新文章 */}
      <section className="latest-articles">
        <div className="container">
          <h2 className="section-title">
            {languageService.getText('LATEST_ARTICLES')}
          </h2>
          <div className="article-grid">
            {latestArticles.map((article) => (
              <article key={article.id} className="article-card">
                <div className="article-meta">
                  <span className="article-date">
                    {getLocaleDate(article.publishedAt)}
                  </span>
                  <span className="article-reading-time">
                    {article.readingTime} {languageService.getText('MIN_READ')}
                  </span>
                </div>
                <h3 className="article-title">
                  <Link to={`/blog/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>
                <p className="article-excerpt">{article.excerpt}</p>
                <div className="article-tags">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div className="view-all-container">
            <Link to="/blogs" className="button button-outline">
              {languageService.getText('VIEW_ALL_ARTICLES')}
            </Link>
          </div>
        </div>
      </section>

      {/* 标签云 */}
      {tags.length > 0 && (
        <section className="tags-section">
          <div className="container">
            <h2 className="section-title">
              {languageService.getText('POPULAR_TAGS')}
            </h2>
            <div className="tags-cloud">
              {tags.slice(0, 20).map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home; 