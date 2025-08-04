import React from 'react';
import { Language } from '@/types';
import { languageService } from '@/services/languageService';
import './FolderList.scss';

export interface FolderItem {
  name: string;
  path: string;
  articles?: any[];
}

interface FolderListProps {
  folders: FolderItem[];
  selectedFolder: string;
  onFolderClick: (folderPath: string) => void;
  showAllArticles?: boolean;
  totalArticles?: number;
  variant?: 'sidebar' | 'modal';
  onClose?: () => void;
}

const FolderList: React.FC<FolderListProps> = ({
  folders,
  selectedFolder,
  onFolderClick,
  showAllArticles = false,
  totalArticles = 0,
  variant = 'sidebar',
  onClose
}) => {
  const handleFolderClick = (folderPath: string) => {
    onFolderClick(folderPath);
    if (variant === 'modal' && onClose) {
      onClose();
    }
  };

  return (
    <div className={`folder-list folder-list--${variant}`}>
      {showAllArticles && (
        <div className="folder-item">
          <button 
            className={`folder-link ${selectedFolder === '' ? 'selected' : ''}`}
            onClick={() => handleFolderClick('')}
          >
            <span className={`folder-name ${selectedFolder === '' ? 'selected' : ''}`}>
              全部文章
            </span>
            <span className={`folder-count ${selectedFolder === '' ? 'selected' : ''}`}>
              ({totalArticles})
            </span>
          </button>
        </div>
      )}
      
      {folders.map((folder) => (
        <div 
          key={folder.path} 
          className="folder-item"
        >
          <button 
            className={`folder-link ${selectedFolder === folder.path ? 'selected' : ''}`}
            onClick={() => handleFolderClick(folder.path)}
          >
            <span 
              className={`folder-name ${selectedFolder === folder.path ? 'selected' : ''}`}
            >
              {folder.name}
            </span>
            <span 
              className={`folder-count ${selectedFolder === folder.path ? 'selected' : ''}`}
            >
              ({folder.articles?.length || 0})
            </span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default FolderList; 