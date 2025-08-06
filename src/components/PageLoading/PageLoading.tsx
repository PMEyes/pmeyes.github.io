import React, { useState, useEffect } from 'react';
import LoadingAnimation from '@/components/LoadingAnimation/LoadingAnimation';
import './PageLoading.scss';

interface PageLoadingProps {
  getText: (key: string) => string;
  theme: string;
}

const PageLoading: React.FC<PageLoadingProps> = ({ getText, theme }) => {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    // 页面刷新时立即显示加载动画
    setShowLoading(true);

    // 监听页面加载完成事件
    const handleLoad = () => {
      // 延迟隐藏加载动画，让用户看到完整的动画效果
      setTimeout(() => {
        setShowLoading(false);
      }, 2500);
    };

    // 如果页面已经加载完成
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      // 监听页面加载完成事件
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  if (!showLoading) {
    return null;
  }

  return (
    <div className="page-loading">
      <LoadingAnimation 
        getText={getText}
        theme={theme}
      />
    </div>
  );
};

export default PageLoading; 