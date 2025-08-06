import React, { useState, useEffect } from 'react';
import './LoadingAnimation.scss';

interface LoadingAnimationProps {
  getText: (key: string) => string;
  theme: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ getText, theme }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const messages = [
    getText('LOADING_MESSAGE_1'),
    getText('LOADING_MESSAGE_2'),
    getText('LOADING_MESSAGE_3'),
    getText('LOADING_MESSAGE_4'),
    getText('LOADING_MESSAGE_5'),
    getText('LOADING_MESSAGE_6'),
    getText('LOADING_MESSAGE_7'),
    getText('LOADING_MESSAGE_8'),
  ];

  useEffect(() => {
    // 启动动画
    setIsVisible(true);

    // 轮播消息
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => {
      clearInterval(messageInterval);
    };
  }, [messages.length]);

  // 确保组件在页面刷新时立即显示
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`loading-animation ${isVisible ? 'visible' : ''}`} data-theme={theme}>
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
        <h2 className="loading-title">{getText('LOADING_TITLE')}</h2>

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