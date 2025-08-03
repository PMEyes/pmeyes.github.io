import React from 'react';
import { Link } from 'react-router-dom';
// import { languageService } from '@/services/languageService';
import './NotFound.scss';

interface NotFoundProps {
  contextValue: {
    language: string;
  };
}

const NotFound: React.FC<NotFoundProps> = ({ contextValue }) => {
  const { language } = contextValue;

  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>
            {language === 'zh-CN' 
              ? '页面未找到'
              : 'Page Not Found'
            }
          </h2>
          <p>
            {language === 'zh-CN'
              ? '抱歉，您访问的页面不存在。'
              : 'Sorry, the page you are looking for does not exist.'
            }
          </p>
          <div className="not-found-actions">
            <Link to="/" className="button">
              {language === 'zh-CN' ? '返回首页' : 'Back to Home'}
            </Link>
            <Link to="/articles" className="button button-outline">
              {language === 'zh-CN' ? '浏览文章' : 'Browse Articles'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 