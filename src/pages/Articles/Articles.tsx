import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { ArticleMeta, Language, SearchFilters } from '@/types';
import { languageService } from '@/services/languageService';
import { articleService } from '@/services/articleService';
import FolderList from './FolderTree/FolderList';
import Modal from '@/components/Modal/Modal';
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
  const [searchParams] = useSearchParams();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [originalFolderTree, setOriginalFolderTree] = useState<any[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [showMobileFolderModal, setShowMobileFolderModal] = useState<boolean>(false);
  const [totalArticlesCount, setTotalArticlesCount] = useState<number>(0);

  useEffect(() => {
    const loadTags = () => {
      const tags = articleService.getAllTags();
      setAllTags(tags);
    };
    loadTags();
  }, []);

  useEffect(() => {
    const loadTotalArticlesCount = async () => {
      const allArticles = await articleService.getAllArticles();
      setTotalArticlesCount(allArticles.length);
    };
    loadTotalArticlesCount();
  }, []);

  useEffect(() => {
    const buildFolderTree = () => {
      // 使用动态生成的目录树数据
      const dynamicFolderTree = articleService.getFolderTree();
      setOriginalFolderTree(dynamicFolderTree);
    };
    
    buildFolderTree();
  }, [articles]);

  useEffect(() => {
    const tagParam = searchParams.get('tag');
    const folderParam = searchParams.get('folder');
    
    // 处理标签参数
    if (tagParam) {
      setSelectedTags([tagParam]);
      onSearch({ query: '', tags: [tagParam] });
    }
    
    // 处理目录参数
    if (folderParam && folderParam !== selectedFolder) {
      setSelectedFolder(folderParam);
      handleFolderClick(folderParam, false); // 不更新标签，避免重复
    } else if (!folderParam && !selectedFolder) {
      // 只有在没有选中目录时才设置为空
      setSelectedFolder('');
    }
  }, [searchParams, onSearch, selectedFolder]);

  // 当组件挂载时，如果有选中的目录，确保筛选状态正确
  useEffect(() => {
    if (selectedFolder && articles.length === 0) {
      // 如果有选中的目录但没有文章，重新应用筛选
      handleFolderClick(selectedFolder, false);
    }
  }, [selectedFolder, articles.length]);

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
    // 不清除目录选择，只清除标签筛选
    // 根据当前选中的目录重新搜索
    if (selectedFolder) {
      onSearch({ query: '', tags: [], folder: selectedFolder });
    } else {
      onClearSearch();
    }
  };

  const handleFolderClick = (folderPath: string, updateTags: boolean = true) => {
    setSelectedFolder(folderPath);
    // 根据目录筛选文章
    if (folderPath) {
      // 从原始数据中获取该目录下文章的所有标签
      if (updateTags) {
        const allArticles = articleService.getAllArticles();
        allArticles.then(articles => {
          const folderArticles = articles.filter(article => {
            // 精确匹配文件夹
            if (article.folder === folderPath) {
              return true;
            }
            // 检查是否是子文件夹
            if (article.folder && article.folder.startsWith(folderPath + '/')) {
              return true;
            }
            return false;
          });
          const folderTags = new Set<string>();
          folderArticles.forEach(article => {
            article.tags.forEach(tag => folderTags.add(tag));
          });
          
          // 更新标签列表为目录下的实际标签
          setAllTags(Array.from(folderTags).sort());
        });
      }
      
      onSearch({ query: '', tags: [], folder: folderPath });
    } else {
      // 如果清空目录选择，显示所有文章和所有标签
      if (updateTags) {
        const allTags = articleService.getAllTags();
        setAllTags(allTags);
      }
      onClearSearch();
    }
  };

  const handleFolderClickWithClear = (folderPath: string) => {
    handleFolderClick(folderPath);
    setSelectedTags([]); // 清空已选标签
  };

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
        {/* 左侧目录树导航 */}
        <div className="articles-sidebar">
          <div className="sidebar-header">
            <h3>{languageService.getText('FOLDERS')}</h3>
          </div>
          <div className="folder-tree">
            <FolderList
              folders={originalFolderTree}
              selectedFolder={selectedFolder}
              onFolderClick={handleFolderClick}
              showAllArticles={true}
              totalArticles={totalArticlesCount}
              variant="sidebar"
            />
          </div>
        </div>

        {/* 右侧文章列表 */}
        <div className="articles-main">
          <div className="articles-header">
            {/* 移动端目录选择器 */}
            <div className="mobile-folder-selector">
              <button 
                className="folder-selector-btn"
                onClick={() => setShowMobileFolderModal(true)}
              >
                <span className="folder-selector-text">
                  {selectedFolder ? selectedFolder : '全部文章'}
                </span>
                <span className="folder-selector-icon">
                  ▼
                </span>
              </button>
            </div>
            
            <div className="header-filters">
              <div className="filter-section">
                <div className="filter-header">
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
                    {selectedTags.length > 0 && (
                      <span
                        className="filter-tag clear-tag"
                        onClick={handleClearFilters}
                      >
                        {languageService.getText('CLEAR_SEARCH')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="articles-content">
            {loading ? (
              <div className="articles-loading">
                <div className="spinner"></div>
                <p>{languageService.getText('LOADING')}</p>
              </div>
            ) : (
              <>
                <div className="articles-stats">
                  {languageService.getText('SEARCH_RESULTS_COUNT', { count: articles.length })}
                </div>

                {articles.length === 0 ? (
                  <div className="no-articles">
                    <h3>{languageService.getText('NO_ARTICLES_FOUND')}</h3>
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
                            {languageService.getText('ARTICLE_READ_TIME', { minutes: article.readingTime })}
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
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* 移动端目录模态框 */}
      <Modal
        isOpen={showMobileFolderModal}
        onClose={() => setShowMobileFolderModal(false)}
        title={languageService.getText('FOLDERS')}
      >
        <FolderList
          folders={originalFolderTree}
          selectedFolder={selectedFolder}
          onFolderClick={handleFolderClickWithClear}
          showAllArticles={true}
          totalArticles={totalArticlesCount}
          variant="modal"
          onClose={() => setShowMobileFolderModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Articles; 