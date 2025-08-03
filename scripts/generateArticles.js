import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 文章文件夹路径
const ARTICLES_DIR = path.join(__dirname, '../articles');
const OUTPUT_FILE = path.join(__dirname, '../src/data/articles.json');

// 扫描文章文件夹
function scanArticles(dir, basePath = '') {
  const articles = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // 递归扫描子文件夹
      const subArticles = scanArticles(fullPath, path.join(basePath, item));
      articles.push(...subArticles);
    } else if (item.endsWith('.md') && item !== 'README.md') {
      // 读取Markdown文件
      const content = fs.readFileSync(fullPath, 'utf-8');
      const { data, content: markdownContent } = matter(content);
      
      // 计算阅读时间（基于字数，假设每分钟200字）
      const wordCount = markdownContent.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200);
      
      // 生成slug（如果没有提供）
      const slug = data.slug || path.basename(item, '.md');
      
      // 确定文件夹路径
      const folder = basePath || '未分类';
      
      const article = {
        id: slug,
        title: data.title || path.basename(item, '.md'),
        excerpt: data.excerpt || markdownContent.substring(0, 150) + '...',
        content: markdownContent,
        publishedAt: data.publishedAt || new Date().toISOString().split('T')[0],
        tags: data.tags || [],
        slug: slug,
        readingTime: data.readingTime || readingTime,
        folder: folder,
        filePath: path.relative(ARTICLES_DIR, fullPath)
      };
      
      articles.push(article);
    }
  }
  
  return articles;
}

// 生成文件夹树结构
function generateFolderTree(articles) {
  const folders = new Map();
  
  articles.forEach(article => {
    const folderPath = article.folder;
    if (!folders.has(folderPath)) {
      folders.set(folderPath, []);
    }
    folders.get(folderPath).push(article);
  });
  
  return Array.from(folders.entries()).map(([folderPath, articles]) => ({
    path: folderPath,
    name: folderPath.split('/').pop() || folderPath,
    articles: articles.map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      publishedAt: article.publishedAt,
      readingTime: article.readingTime,
      tags: article.tags
    }))
  }));
}

// 主函数
function main() {
  try {
    console.log('开始扫描文章文件夹...');
    
    // 扫描所有文章
    const articles = scanArticles(ARTICLES_DIR);
    
    // 生成文件夹树
    const folderTree = generateFolderTree(articles);
    
    // 生成输出数据
    const output = {
      articles: articles,
      folderTree: folderTree,
      lastUpdated: new Date().toISOString()
    };
    
    // 确保输出目录存在
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 写入文件
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    
    console.log(`成功生成文章数据：`);
    console.log(`- 文章数量: ${articles.length}`);
    console.log(`- 文件夹数量: ${folderTree.length}`);
    console.log(`- 输出文件: ${OUTPUT_FILE}`);
    
    // 显示文件夹结构
    console.log('\n文件夹结构:');
    folderTree.forEach(folder => {
      console.log(`  ${folder.path} (${folder.articles.length} 篇文章)`);
    });
    
  } catch (error) {
    console.error('生成文章数据时出错:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
main(); 