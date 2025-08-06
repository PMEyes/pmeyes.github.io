import React from 'react';
import { Link } from 'react-router-dom';
import { Language } from '@/types';
import { languageService } from '@/services/languageService';
import './ErrorDisplay.scss';

interface ErrorDisplayProps {
  language: Language;
  title?: string;
  message?: string;
  showRetry?: boolean;
  showHomeButton?: boolean;
  onRetry?: () => void;
  customActions?: React.ReactNode;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title,
  message,
  showRetry = true,
  showHomeButton = true,
  onRetry,
  customActions
}) => {
  const defaultTitle = languageService.getText('ERROR_OCCURRED');
  const defaultMessage = languageService.getText('SOMETHING_WENT_WRONG');

  return (
    <div className="error-display">
      <div className="error-content">
        <div className="error-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
            <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        
        <h1 className="error-title">
          {title || defaultTitle}
        </h1>
        
        <p className="error-message">
          {message || defaultMessage}
        </p>
        
        <div className="error-actions">
          {customActions ? (
            customActions
          ) : (
            <>
              {showRetry && onRetry && (
                <button className="button button-primary" onClick={onRetry}>
                  {languageService.getText('RETRY')}
                </button>
              )}
              
              {showHomeButton && (
                <Link to="/" className="button button-secondary">
                  {languageService.getText('BACK_TO_HOME')}
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay; 