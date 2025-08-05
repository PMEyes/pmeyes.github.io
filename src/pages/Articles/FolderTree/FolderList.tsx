import React, { useState } from 'react';
import './FolderList.scss';

export interface FolderItem {
  name: string;
  path: string;
  articles?: any[];
  children?: FolderItem[];
  level?: number;
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
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const handleFolderClick = (folderPath: string) => {
    onFolderClick(folderPath);
    if (variant === 'modal' && onClose) {
      onClose();
    }
  };

  const toggleFolder = (folderPath: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  // 计算文件夹的总文章数（包括子文件夹）
  const calculateTotalArticles = (folder: FolderItem): number => {
    let total = folder.articles?.length || 0;
    
    if (folder.children) {
      for (const child of folder.children) {
        total += calculateTotalArticles(child);
      }
    }
    
    return total;
  };

  const renderFolder = (folder: FolderItem, level: number = 0) => {
    const hasChildren = folder.children && folder.children.length > 0;
    const isExpanded = expandedFolders.has(folder.path);
    const indentStyle = { paddingLeft: `${level * 20}px` };
    const totalArticles = calculateTotalArticles(folder);

    return (
      <div key={folder.path} className="folder-item">
        <div className="folder-row" style={indentStyle}>
          {hasChildren && (
            <button
              className={`folder-toggle ${isExpanded ? 'expanded' : ''}`}
              onClick={(e) => toggleFolder(folder.path, e)}
              aria-label={isExpanded ? '折叠文件夹' : '展开文件夹'}
            >
              <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
            </button>
          )}
          {!hasChildren && <div className="folder-spacer" />}
          
          <button 
            className={`folder-link ${selectedFolder === folder.path ? 'selected' : ''}`}
            onClick={() => handleFolderClick(folder.path)}
          >
            <span className={`folder-name ${selectedFolder === folder.path ? 'selected' : ''}`}>
              {folder.name}
            </span>
            <span className={`folder-count ${selectedFolder === folder.path ? 'selected' : ''}`}>
              ({totalArticles})
            </span>
          </button>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="folder-children">
            {folder.children!.map(child => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`folder-list folder-list--${variant}`}>
      {showAllArticles && (
        <div className="folder-item">
          <div className="folder-row">
            <div className="folder-spacer" />
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
        </div>
      )}
      
      {folders.map((folder) => renderFolder(folder))}
    </div>
  );
};

export default FolderList; 