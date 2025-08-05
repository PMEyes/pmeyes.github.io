import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Language, Theme } from '@/types';
import { languageService } from '@/services/languageService';
import { themeService } from '@/services/themeService';
import { articleService } from '@/services/articleService';
import { ArticleMeta, SearchFilters } from '@/types';
import Navbar from '@/components/Navbar/Navbar';
import Home from '@/pages/Home/Home';
import Articles from '@/pages/Articles/Articles';
import ArticleDetail from '@/pages/ArticleDetail/ArticleDetail';
import About from '@/pages/About/About';
import ThemePreview from '@/pages/ThemePreview/ThemePreview';
import NotFound from '@/pages/NotFound/NotFound';

function App() {
  const [language, setLanguage] = useState<Language>(languageService.getCurrentLanguage());
  const [theme, setTheme] = useState<Theme>(themeService.getCurrentTheme());
  const [articles, setArticles] = useState<ArticleMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    tags: [],
  });

  useEffect(() => {
    loadArticles();
    // 初始化主题
    themeService.initializeTheme();
  }, []);

  // 监听语言变化，更新页面标题
  useEffect(() => {
    const siteTitle = languageService.getText('SITE_TITLE');
    document.title = siteTitle;
  }, [language]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const articlesData = await articleService.getAllArticles();
      setArticles(articlesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载文章失败');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (newLanguage: Language) => {
    languageService.setLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  const handleThemeChange = (newTheme: Theme) => {
    themeService.setTheme(newTheme);
    setTheme(newTheme);
  };

  const handleSearch = async (filters: SearchFilters) => {
    try {
      setLoading(true);
      setError(null);
      setSearchFilters(filters);
      const searchResults = await articleService.searchArticles(filters);
      setArticles(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : '搜索失败');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchFilters({ query: '', tags: [] });
    // 保持当前的目录筛选
    if (searchFilters.folder) {
      handleSearch({ query: '', tags: [], folder: searchFilters.folder });
    } else {
      loadArticles();
    }
  };

  const contextValue = {
    language,
    theme,
    articles,
    loading,
    error,
    searchFilters,
    onLanguageChange: handleLanguageChange,
    onThemeChange: handleThemeChange,
    onSearch: handleSearch,
    onClearSearch: handleClearSearch,
    onRetry: loadArticles,
  };

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app">
        <Navbar 
          language={language}
          theme={theme}
          onLanguageChange={handleLanguageChange}
          onThemeChange={handleThemeChange}
          onSearch={handleSearch}
          searchFilters={searchFilters}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home contextValue={contextValue} />} />
            <Route path="/articles" element={<Articles contextValue={contextValue} />} />
            <Route path="/article/:slug" element={<ArticleDetail contextValue={contextValue} />} />
            <Route path="/about" element={<About contextValue={contextValue} />} />
            <Route path="/themes" element={<ThemePreview currentTheme={theme} onThemeChange={handleThemeChange} />} />
            <Route path="*" element={<NotFound contextValue={contextValue} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 