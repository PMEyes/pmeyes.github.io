import React from 'react';
import { Link } from 'react-router-dom';
import { languageService } from '@/services/languageService';
import './NotFound.scss';

interface NotFoundProps {
  contextValue: {
    language: string;
  };
}

const NotFound: React.FC<NotFoundProps> = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>
            {languageService.getText('PAGE_NOT_FOUND')}
          </h2>
          <p>
            {languageService.getText('PAGE_NOT_FOUND_DESCRIPTION')}
          </p>
          <div className="not-found-actions">
            <Link to="/" className="button">
              {languageService.getText('BACK_TO_HOME')}
            </Link>
            <Link to="/articles" className="button button-outline">
              {languageService.getText('BROWSE_ARTICLES')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 