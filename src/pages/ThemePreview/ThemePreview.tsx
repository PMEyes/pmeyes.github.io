import React from 'react';
import { Theme } from '@/types';
import { themeService } from '@/services/themeService';
import { languageService } from '@/services/languageService';
import './ThemePreview.scss';

interface ThemePreviewProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ currentTheme, onThemeChange }) => {
  const themeList = themeService.getLocalizedThemeList();

  return (
    <div className="theme-preview">
      <div className="container">
        <h1>{languageService.getText('THEME_PREVIEW')}</h1>
        <p>{languageService.getText('THEME_PREVIEW_DESCRIPTION')}</p>
        
        <div className="theme-grid">
          {themeList.map(({ key, config }) => (
            <div
              key={key}
              className={`theme-card ${key === currentTheme ? 'active' : ''}`}
              onClick={() => onThemeChange(key as Theme)}
            >
              <div className="theme-card__header">
                <h3>{config.name}</h3>
                <span className="theme-card__mood">{config.mood}</span>
              </div>
              
              <div className="theme-card__colors">
                              <div 
                className="theme-card__color"
                style={{ backgroundColor: config.colors.primary }}
                title={languageService.getText('PRIMARY_COLOR')}
              />
              <div 
                className="theme-card__color"
                style={{ backgroundColor: config.colors.secondary }}
                title={languageService.getText('SECONDARY_COLOR')}
              />
              <div 
                className="theme-card__color"
                style={{ backgroundColor: config.colors.success }}
                title={languageService.getText('SUCCESS_COLOR')}
              />
              <div 
                className="theme-card__color"
                style={{ backgroundColor: config.colors.danger }}
                title={languageService.getText('DANGER_COLOR')}
              />
              </div>
              
              <p className="theme-card__description">{config.description}</p>
              
              {key === currentTheme && (
                <div className="theme-card__active-indicator">
                  <span>{languageService.getText('CURRENT_THEME')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="theme-demo">
          <h2>{languageService.getText('THEME_DEMO')}</h2>
          <div className="demo-section">
            <h3>{languageService.getText('BUTTON_STYLES')}</h3>
            <div className="demo-buttons">
              <button className="button">{languageService.getText('PRIMARY_BUTTON')}</button>
              <button className="button button-outline">{languageService.getText('OUTLINE_BUTTON')}</button>
              <button className="button button-secondary">{languageService.getText('SECONDARY_BUTTON')}</button>
            </div>
          </div>
          
          <div className="demo-section">
            <h3>{languageService.getText('CARD_STYLES')}</h3>
            <div className="demo-cards">
              <div className="card">
                <h4>{languageService.getText('SAMPLE_CARD')}</h4>
                <p>{languageService.getText('SAMPLE_CARD_DESCRIPTION')}</p>
                <div className="card-tags">
                  <span className="tag">{languageService.getText('TAG_1')}</span>
                  <span className="tag">{languageService.getText('TAG_2')}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="demo-section">
            <h3>{languageService.getText('TEXT_STYLES')}</h3>
            <div className="demo-text">
              <h1>{languageService.getText('HEADING_TEXT')}</h1>
              <h2>{languageService.getText('SUBHEADING')}</h2>
              <p>{languageService.getText('BODY_TEXT')}</p>
              <p className="text-secondary">{languageService.getText('SECONDARY_TEXT')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemePreview; 