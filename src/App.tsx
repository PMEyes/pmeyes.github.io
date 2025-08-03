import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Language } from '@/types';
import { languageService } from '@/services/languageService';
import { articleService } from '@/services/articleService';
import { ArticleMeta, SearchFilters } from '@/types';
import Navbar from '@/components/Navbar/Navbar';
import Home from '@/pages/Home/Home';
import Articles from '@/pages/Articles/Articles';
import ArticleDetail from '@/pages/ArticleDetail/ArticleDetail';
import About from '@/pages/About/About';
import NotFound from '@/pages/NotFound/NotFound';

function App() {
  const [language, setLanguage] = useState<Language>(languageService.getCurrentLanguage());
  const [articles, setArticles] = useState<ArticleMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    tags: [],
  });

  useEffect(() => {
    loadArticles();
  }, []);

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
    loadArticles();
  };

  const contextValue = {
    language,
    articles,
    loading,
    error,
    searchFilters,
    onLanguageChange: handleLanguageChange,
    onSearch: handleSearch,
    onClearSearch: handleClearSearch,
    onRetry: loadArticles,
  };

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app">
        <Navbar 
          language={language}
          onLanguageChange={handleLanguageChange}
          onSearch={handleSearch}
          searchFilters={searchFilters}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home contextValue={contextValue} />} />
            <Route path="/articles" element={<Articles contextValue={contextValue} />} />
            <Route path="/article/:slug" element={<ArticleDetail contextValue={contextValue} />} />
            <Route path="/about" element={<About contextValue={contextValue} />} />
            <Route path="*" element={<NotFound contextValue={contextValue} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 