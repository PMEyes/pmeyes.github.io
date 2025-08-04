import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { Language, SearchFilters, Theme } from '@/types';
import { languageService } from '@/services/languageService';
import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher';
import './Navbar.scss';

interface NavbarProps {
  language: Language;
  theme: Theme;
  onLanguageChange: (language: Language) => void;
  onThemeChange: (theme: Theme) => void;
  onSearch: (filters: SearchFilters) => void;
  searchFilters: SearchFilters;
}

const Navbar: React.FC<NavbarProps> = ({
  language,
  theme,
  onLanguageChange,
  onThemeChange,
  onSearch,
  searchFilters,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchFilters.query);
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      query: searchQuery,
      tags: searchFilters.tags,
    });
  };

  const handleLanguageChange = (newLanguage: Language) => {
    onLanguageChange(newLanguage);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <Link to="/" onClick={closeMobileMenu}>
            <div className="brand-content">
              <img src="/logo.jpg" alt="PM Eyes Logo" className="brand-logo" />
              <h1>{languageService.getText('SITE_TITLE')}</h1>
            </div>
          </Link>
        </div>

        <div className="navbar-search">
          <form onSubmit={handleSearch} className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder={languageService.getText('SEARCH_PLACEHOLDER')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        <div className="navbar-nav desktop-menu">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            {languageService.getText('HOME')}
          </Link>
          <Link 
            to="/articles" 
            className={`nav-link ${isActive('/articles') ? 'active' : ''}`}
          >
            {languageService.getText('ARTICLES')}
          </Link>
          <Link 
            to="/themes" 
            className={`nav-link ${isActive('/themes') ? 'active' : ''}`}
          >
            {languageService.getText('THEME_PREVIEW_NAV')}
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
          >
            {languageService.getText('ABOUT')}
          </Link>
        </div>

        <div className="navbar-controls">
          <div className="navbar-language">
            <div className="language-switcher">
              <button
                className={`language-btn ${language === 'zh-CN' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('zh-CN')}
              >
                {languageService.getText('CHINESE')}
              </button>
              <button
                className={`language-btn ${language === 'en-US' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('en-US')}
              >
                {languageService.getText('ENGLISH')}
              </button>
            </div>
          </div>

          <div className="navbar-theme">
            <ThemeSwitcher 
              currentTheme={theme}
              language={language}
              onThemeChange={onThemeChange}
            />
          </div>
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label={languageService.getText('MENU')}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 移动端菜单 */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <Link 
              to="/" 
              className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              {languageService.getText('HOME')}
            </Link>
            <Link 
              to="/articles" 
              className={`mobile-nav-link ${isActive('/articles') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              {languageService.getText('ARTICLES')}
            </Link>
            <Link 
              to="/themes" 
              className={`mobile-nav-link ${isActive('/themes') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              {languageService.getText('THEME_PREVIEW_NAV')}
            </Link>
            <Link 
              to="/about" 
              className={`mobile-nav-link ${isActive('/about') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              {languageService.getText('ABOUT')}
            </Link>
            <div className="mobile-controls">
              <div className="mobile-language-switcher">
                <button
                  className={`language-btn ${language === 'zh-CN' ? 'active' : ''}`}
                  onClick={() => {
                    handleLanguageChange('zh-CN');
                    closeMobileMenu();
                  }}
                >
                  {languageService.getText('CHINESE')}
                </button>
                <button
                  className={`language-btn ${language === 'en-US' ? 'active' : ''}`}
                  onClick={() => {
                    handleLanguageChange('en-US');
                    closeMobileMenu();
                  }}
                >
                  {languageService.getText('ENGLISH')}
                </button>
              </div>
              <div className="mobile-theme-switcher">
                <ThemeSwitcher 
                  currentTheme={theme}
                  language={language}
                  onThemeChange={onThemeChange}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 