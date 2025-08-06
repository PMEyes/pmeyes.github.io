import React, { useState, useEffect } from 'react';
import './LoadingAnimation.scss';

interface LoadingAnimationProps {
  getText: (key: string) => string;
  theme: string;
}

// 默认的加载文本
const DEFAULT_LOADING_TEXTS = {
  'LOADING_TITLE': '正在加载...',
  'LOADING_MESSAGE_1': '正在初始化应用...',
  'LOADING_MESSAGE_2': '正在加载多语言包...',
  'LOADING_MESSAGE_3': '正在加载主题配置...',
  'LOADING_MESSAGE_4': '正在获取文章数据...',
  'LOADING_MESSAGE_5': '正在优化性能...',
  'LOADING_MESSAGE_6': '即将完成...',
  'LOADING_MESSAGE_7': '正在准备界面...',
  'LOADING_MESSAGE_8': '加载完成！',
};

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ getText, theme }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // 获取文本，如果返回的是原始键名，则使用默认值
  const getTextWithDefault = (key: string): string => {
    const text = getText(key);
    // 如果返回的文本包含 "LOADING_" 且等于键名，说明多语言还没加载，使用默认值
    if (text === key && key.startsWith('LOADING_')) {
      return DEFAULT_LOADING_TEXTS[key as keyof typeof DEFAULT_LOADING_TEXTS] || key;
    }
    return text;
  };

  const messages = [
    getTextWithDefault('LOADING_MESSAGE_1'),
    getTextWithDefault('LOADING_MESSAGE_2'),
    getTextWithDefault('LOADING_MESSAGE_3'),
    getTextWithDefault('LOADING_MESSAGE_4'),
    getTextWithDefault('LOADING_MESSAGE_5'),
    getTextWithDefault('LOADING_MESSAGE_6'),
    getTextWithDefault('LOADING_MESSAGE_7'),
    getTextWithDefault('LOADING_MESSAGE_8'),
  ];

  useEffect(() => {
    // 轮播消息
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => {
      clearInterval(messageInterval);
    };
  }, [messages.length]);

  return (
    <div className="loading-animation visible" data-theme={theme}>
      <div className="loading-container">
        {/* 眼睛图标 */}
        <div className="eye-icon">
          <div className="eye">
            <div className="eyelid"></div>
            <div className="pupil"></div>
            <div className="sparkle"></div>
          </div>
        </div>

        {/* 加载标题 */}
        <h2 className="loading-title">{getTextWithDefault('LOADING_TITLE')}</h2>

        {/* 轮播消息 */}
        <div className="message-container">
          <div className="message-slider">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${index === currentMessageIndex ? 'active' : ''}`}
              >
                {message}
              </div>
            ))}
          </div>
        </div>

        {/* 加载点 */}
        <div className="loading-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation; 