import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
// 暂时禁用语法高亮以避免类型错误
// import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-light';
// import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Article, Language } from '@/types';
import { languageService } from '@/services/languageService';
import { articleService } from '@/services/articleService';
import './ArticleDetail.scss';

interface ArticleDetailProps {
  contextValue: {
    language: Language;
    onRetry: () => void;
  };
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ contextValue }) => {
  const { language, onRetry } = contextValue;
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (slug) {
      loadArticle(slug);
    }
  }, [slug]);

  // 设置页面标题
  useEffect(() => {
    if (article) {
      const siteTitle = languageService.getText('SITE_TITLE');
      document.title = `${article.title} - ${siteTitle}`;
    }
  }, [article, language]);

  const loadArticle = async (articleSlug: string) => {
    try {
      setLoading(true);
      setError(null);
      const articleData = await articleService.getArticleBySlug(articleSlug);
      if (articleData) {
        setArticle(articleData);
        const related = articleService.getRelatedArticles(articleSlug);
        // 将ArticleMeta转换为Article类型
        const relatedArticles = related.map(meta => ({
          ...meta,
          content: '' // 相关文章不需要完整内容
        }));
        setRelatedArticles(relatedArticles);
      } else {
        setError('文章未找到');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载文章失败');
    } finally {
      setLoading(false);
    }
  };

  const getLocaleDate = (dateString: string) => {
    const date = new Date(dateString);
    if (language === 'zh-CN') {
      return format(date, 'yyyy年MM月dd日', { locale: zhCN });
    }
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

  if (error || !article) {
    return (
      <div className="error-container">
        <h2>{languageService.getText('ERROR_OCCURRED')}</h2>
        <p>{error || '文章未找到'}</p>
        <button className="button" onClick={onRetry}>
          {languageService.getText('RETRY')}
        </button>
        <Link to="/" className="button button-secondary">
          {languageService.getText('BACK_TO_HOME')}
        </Link>
      </div>
    );
  }

  return (
    <div className="article-detail">
      <div className="container">
        <div className="article-header">
          <h1 className="article-title">{article.title}</h1>
          <div className="article-meta">
            <time dateTime={article.publishedAt}>
              {getLocaleDate(article.publishedAt)}
            </time>
            <span className="reading-time">
              {languageService.getText('ARTICLE_READ_TIME', { minutes: article.readingTime })}
            </span>
          </div>
          <div className="article-tags">
            {article.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="article-body">
          <div className="article-content">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <pre className={`language-${match[1]}`}>
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>
        </div>

        {relatedArticles.length > 0 && (
          <div className="related-articles">
            <h3>{languageService.getText('RELATED_ARTICLES')}</h3>
            <div className="related-grid">
              {relatedArticles.map((relatedArticle) => (
                <article key={relatedArticle.id} className="article-card">
                  <div className="article-meta">
                    <time dateTime={relatedArticle.publishedAt}>
                      {getLocaleDate(relatedArticle.publishedAt)}
                    </time>
                    <span className="reading-time">
                      {languageService.getText('ARTICLE_READ_TIME', { minutes: relatedArticle.readingTime })}
                    </span>
                  </div>
                  <h3 className="article-title">
                    <Link to={`/article/${relatedArticle.slug}`}>
                      {relatedArticle.title}
                    </Link>
                  </h3>
                  <p className="article-excerpt">{relatedArticle.excerpt}</p>
                  <div className="article-tags">
                    {relatedArticle.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail; 