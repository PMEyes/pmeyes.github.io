import React, { useState } from 'react';
import { Theme, Language } from '@/types';
import { themeService } from '@/services/themeService';
import { languageService } from '@/services/languageService';
import './ThemeSwitcher.scss';

interface ThemeSwitcherProps {
  currentTheme: Theme;
  language?: Language;
  onThemeChange: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, language, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const themeList = language ? themeService.getLocalizedThemeList() : themeService.getThemeList();

  const handleThemeChange = (theme: Theme) => {
    onThemeChange(theme);
    setIsOpen(false);
  };

  const currentThemeConfig = language ? 
    themeService.getLocalizedThemeList().find(t => t.key === currentTheme)?.config || themeService.getThemeConfig(currentTheme) :
    themeService.getThemeConfig(currentTheme);

  return (
    <div className="theme-switcher">
      <button
        className="theme-switcher__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="切换主题"
      >
        <div className="theme-switcher__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </div>
        <span className="theme-switcher__label">{currentThemeConfig.name}</span>
        <svg 
          className={`theme-switcher__arrow ${isOpen ? 'open' : ''}`}
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <polyline points="6,9 12,15 18,9" />
        </svg>
      </button>

      {isOpen && (
        <div className="theme-switcher__dropdown">
          <div className="theme-switcher__header">
            <h3>{languageService.getText('THEME_PREVIEW')}</h3>
            <p>{languageService.getText('THEME_PREVIEW_DESCRIPTION')}</p>
          </div>
          <div className="theme-switcher__options">
            {themeList.map(({ key, config }) => (
              <button
                key={key}
                className={`theme-switcher__option ${key === currentTheme ? 'active' : ''}`}
                onClick={() => handleThemeChange(key as Theme)}
              >
                <div className="theme-switcher__option-preview">
                  <div 
                    className="theme-switcher__color-preview"
                    style={{ backgroundColor: config.colors.primary }}
                  />
                  <div 
                    className="theme-switcher__color-preview"
                    style={{ backgroundColor: config.colors.secondary }}
                  />
                  <div 
                    className="theme-switcher__color-preview"
                    style={{ backgroundColor: config.colors.success }}
                  />
                </div>
                <div className="theme-switcher__option-info">
                  <h4>{config.name}</h4>
                  <p>{config.description}</p>
                  <span className="theme-switcher__mood">{config.mood}</span>
                </div>
                {key === currentTheme && (
                  <div className="theme-switcher__check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 遮罩层 */}
      {isOpen && (
        <div 
          className="theme-switcher__overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ThemeSwitcher; 