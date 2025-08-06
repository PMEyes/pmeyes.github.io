import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Language, Theme } from '@/types';
import { themeService } from '@/services/themeService';
import { articleService } from '@/services/articleService';
import { ArticleMeta, SearchFilters } from '@/types';
import { store } from '@/store';
import { useLocaleRegistration } from '@/hooks/useLocaleRegistration';
import { loadingService } from '@/services/loadingService';
import Navbar from '@/components/Navbar/Navbar';
import Home from '@/pages/Home/Home';
import Articles from '@/pages/Articles/Articles';
import ArticleDetail from '@/pages/ArticleDetail/ArticleDetail';
import About from '@/pages/About/About';
import ThemePreview from '@/pages/ThemePreview/ThemePreview';
import NotFound from '@/pages/NotFound/NotFound';

function AppContent() {
  const [theme, setTheme] = useState<Theme>(themeService.getCurrentTheme());
  const [articles, setArticles] = useState<ArticleMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    tags: [],
  });

  // 使用语言包注册 hook
  const {
    isRegistered,
    isLoading: localeLoading,
    error: localeError,
    currentLanguage,
    switchLanguage,
    getText,
  } = useLocaleRegistration({
    autoRegister: true,
    onRegistrationComplete: () => {
      // 语言包注册完成
    },
    onRegistrationError: (error) => {
      console.error('Locale registration failed:', error);
    },
    onLanguageSwitch: () => {
      // 语言切换完成
    },
  });

  // 1. 语言包注册完成后，初始化主题
  useEffect(() => {
    if (isRegistered) {
      themeService.initializeTheme();
    }
  }, [isRegistered]);

  // 2. 语言包注册完成后，加载文章数据
  useEffect(() => {
    if (isRegistered) {
      loadArticles();
    }
  }, [isRegistered]);

  // 3. 所有初始化完成后，隐藏加载动画
  useEffect(() => {
    if (isRegistered && !loading && !localeLoading) {
      loadingService.hide();
    }
  }, [isRegistered, loading, localeLoading]);

  // 监听语言变化，更新页面标题
  useEffect(() => {
    if (isRegistered) {
      const siteTitle = getText('SITE_TITLE');
      document.title = siteTitle;
    }
  }, [currentLanguage, isRegistered, getText]);

  // 加载文章数据
  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const articlesData = await articleService.getAllArticles();
      setArticles(articlesData);
    } catch (err) {
      console.error('Failed to load articles:', err);
      setError(err instanceof Error ? err.message : '加载文章失败');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (newLanguage: Language) => {
    try {
      await switchLanguage(newLanguage);
    } catch (error) {
      console.error('Failed to switch language:', error);
    }
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
      console.error('搜索错误:', err);
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
    language: currentLanguage,
    theme,
    articles,
    loading: loading || localeLoading,
    error: error || localeError || null,
    searchFilters,
    onLanguageChange: handleLanguageChange,
    onThemeChange: handleThemeChange,
    onSearch: handleSearch,
    onClearSearch: handleClearSearch,
    onRetry: loadArticles,
  };

  // 如果语言包服务还未注册完成，不渲染主界面
  if (!isRegistered) {
    return null;
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app">
        <Navbar 
          language={currentLanguage}
          theme={theme}
          onLanguageChange={handleLanguageChange}
          onThemeChange={handleThemeChange}
          onSearch={handleSearch}
          searchFilters={searchFilters}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home contextValue={contextValue} />} />
            <Route path="/blogs" element={<Articles contextValue={contextValue} />} />
            <Route path="/blog/:slug" element={<ArticleDetail contextValue={contextValue} />} />
            <Route path="/about" element={<About contextValue={contextValue} />} />
            <Route path="/themes" element={<ThemePreview currentTheme={theme} onThemeChange={handleThemeChange} />} />
            <Route path="*" element={<NotFound contextValue={contextValue} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App; 