import { languageService } from '@/services/languageService';

/**
 * 测试多语言变量替换功能
 */
export const testLanguageVariables = () => {
  console.log('=== 多语言变量替换测试 ===');
  
  // 测试基础文本（无变量）
  console.log('基础文本:', languageService.getText('SITE_TITLE'));
  
  // 测试搜索结果数量
  console.log('搜索结果:', languageService.getText('SEARCH_RESULTS_COUNT', { count: 15 }));
  
  // 测试阅读时间
  console.log('阅读时间:', languageService.getText('ARTICLE_READ_TIME', { minutes: 8 }));
  
  // 测试文件夹文章统计
  console.log('文件夹统计:', languageService.getText('FOLDER_ARTICLES_COUNT', { 
    folder: '项目管理', 
    count: 12 
  }));
  
  // 测试标签数量
  console.log('标签数量:', languageService.getText('TAG_COUNT', { count: 25 }));
  
  // 测试发布日期
  console.log('发布日期:', languageService.getText('PUBLISHED_DATE', { date: '2024-01-15' }));
  
  console.log('=== 测试完成 ===');
};

/**
 * 验证语言文件中的变量格式
 */
export const validateLanguageFiles = async () => {
  const zhCN = languageService.getLocaleData();
  const allLocales = await languageService.getAllLocales();
  const enUS = allLocales['en-US'];
  
  console.log('=== 语言文件验证 ===');
  
  // 检查包含变量的键
  const variableKeys = [
    'SEARCH_RESULTS_COUNT',
    'ARTICLE_READ_TIME', 
    'FOLDER_ARTICLES_COUNT',
    'TAG_COUNT',
    'PUBLISHED_DATE'
  ];
  
  variableKeys.forEach(key => {
    const zhText = zhCN[key];
    const enText = enUS[key];
    
    if (zhText && enText) {
      console.log(`✓ ${key}: 中英文都存在`);
      console.log(`  中文: ${zhText}`);
      console.log(`  英文: ${enText}`);
    } else {
      console.log(`✗ ${key}: 缺失`);
    }
  });
  
  console.log('=== 验证完成 ===');
}; 