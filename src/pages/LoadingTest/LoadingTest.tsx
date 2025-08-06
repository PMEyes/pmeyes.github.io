import React, { useState } from 'react';
import LoadingAnimation from '@/components/LoadingAnimation/LoadingAnimation';
import { Language, Theme } from '@/types';
import { languageService } from '@/services/languageService';
import './LoadingTest.scss';

interface LoadingTestProps {
  contextValue: {
    language: Language;
    theme: Theme;
    articles: any[];
    loading: boolean;
    error: string | null;
    searchFilters: any;
    onLanguageChange: (language: Language) => Promise<void>;
    onThemeChange: (theme: Theme) => void;
    onSearch: (filters: any) => Promise<void>;
    onClearSearch: () => void;
    onRetry: () => void;
  };
}

const LoadingTest: React.FC<LoadingTestProps> = ({ contextValue }) => {
  const { language, theme } = contextValue;
  const [showLoading, setShowLoading] = useState(false);

  const handleShowLoading = () => {
    setShowLoading(true);
    // 3秒后隐藏加载动画
    setTimeout(() => {
      setShowLoading(false);
    }, 3000);
  };

  return (
    <div className="loading-test">
      <div className="container">
        <h1>加载动画测试页面</h1>
        <p>点击下面的按钮来测试加载动画效果</p>
        
        <div className="test-controls">
          <button 
            className="button" 
            onClick={handleShowLoading}
            disabled={showLoading}
          >
            显示加载动画
          </button>
        </div>

        <div className="theme-info">
          <h3>当前主题信息</h3>
          <p>主题: {theme}</p>
          <p>语言: {language}</p>
          <div className="theme-controls">
            <button 
              className="button button-outline"
              onClick={() => contextValue.onThemeChange('sunny')}
            >
              切换到阳光主题
            </button>
            <button 
              className="button button-outline"
              onClick={() => contextValue.onThemeChange('calm')}
            >
              切换到宁静主题
            </button>
            <button 
              className="button button-outline"
              onClick={() => contextValue.onThemeChange('night')}
            >
              切换到夜间主题
            </button>
          </div>
        </div>
      </div>

      {showLoading && (
        <LoadingAnimation 
          getText={(key: string) => languageService.getText(key)}
          theme={theme}
        />
      )}
    </div>
  );
};

export default LoadingTest; 