import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 文章文件夹路径
const ARTICLES_DIR = path.join(__dirname, '../articles');
const OUTPUT_FILE = path.join(__dirname, '../src/data/articles.json');
const CACHE_FILE = path.join(__dirname, '../src/data/.articles-cache.json');

// 计算文件哈希值
function calculateFileHash(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return crypto.createHash('md5').update(content).digest('hex');
}

// 获取文件修改时间
function getFileMtime(filePath) {
  return fs.statSync(filePath).mtime.getTime();
}

// 检查文件是否有修改
function hasFileChanges() {
  try {
    // 如果缓存文件不存在，需要重新生成
    if (!fs.existsSync(CACHE_FILE)) {
      console.log('缓存文件不存在，需要重新生成文章数据');
      return true;
    }

    // 读取缓存文件
    const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    
    // 扫描文章文件夹，检查是否有文件变化
    const currentFiles = scanFiles(ARTICLES_DIR);
    
    // 检查是否有新文件、删除的文件或修改的文件
    for (const file of currentFiles) {
      const relativePath = path.relative(ARTICLES_DIR, file);
      
      if (!cache.files[relativePath]) {
        console.log(`发现新文件: ${relativePath}`);
        return true;
      }
      
      const currentHash = calculateFileHash(file);
      const currentMtime = getFileMtime(file);
      
      if (cache.files[relativePath].hash !== currentHash || 
          cache.files[relativePath].mtime !== currentMtime) {
        console.log(`文件已修改: ${relativePath}`);
        return true;
      }
    }
    
    // 检查是否有删除的文件
    for (const cachedFile in cache.files) {
      const fullPath = path.join(ARTICLES_DIR, cachedFile);
      if (!fs.existsSync(fullPath)) {
        console.log(`文件已删除: ${cachedFile}`);
        return true;
      }
    }
    
    console.log('文章文件无变化，跳过生成');
    return false;
    
  } catch (error) {
    console.log('检查文件变化时出错，重新生成文章数据');
    return true;
  }
}

// 扫描所有文件（包括目录）
function scanFiles(dir, basePath = '') {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // 递归扫描子文件夹
      const subFiles = scanFiles(fullPath, path.join(basePath, item));
      files.push(...subFiles);
    } else if (item.endsWith('.md')) {
      // 只处理 Markdown 文件
      files.push(fullPath);
    }
  }
  
  return files;
}

// 更新缓存文件
function updateCache(articles) {
  const files = {};
  
  // 扫描所有文件并记录哈希值和修改时间
  const allFiles = scanFiles(ARTICLES_DIR);
  
  for (const file of allFiles) {
    const relativePath = path.relative(ARTICLES_DIR, file);
    files[relativePath] = {
      hash: calculateFileHash(file),
      mtime: getFileMtime(file)
    };
  }
  
  const cache = {
    files,
    lastUpdated: new Date().toISOString(),
    articleCount: articles.length
  };
  
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

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
      
      // 只保存元数据，不包含文章内容
      const article = {
        id: slug,
        title: data.title || path.basename(item, '.md'),
        excerpt: data.excerpt || markdownContent.substring(0, 150) + '...',
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
  const folderMap = new Map();
  
  // 首先按文件夹路径分组文章
  articles.forEach(article => {
    const folderPath = article.folder;
    if (!folderMap.has(folderPath)) {
      folderMap.set(folderPath, []);
    }
    folderMap.get(folderPath).push(article);
  });
  
  // 构建树形结构
  const buildTree = (folderPath) => {
    const folderName = folderPath.split('/').pop() || folderPath;
    const articles = folderMap.get(folderPath) || [];
    
    const node = {
      path: folderPath,
      name: folderName,
      articles: articles.map(article => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        publishedAt: article.publishedAt,
        readingTime: article.readingTime,
        tags: article.tags
      })),
      children: []
    };
    
    // 查找子文件夹
    const childFolders = [];
    for (const [path, pathArticles] of folderMap.entries()) {
      if (path !== folderPath && path.startsWith(folderPath + '/')) {
        // 检查是否是直接子文件夹（不是孙子文件夹）
        const relativePath = path.substring(folderPath.length + 1);
        if (!relativePath.includes('/')) {
          // 这是直接子文件夹
          childFolders.push(path);
        }
      }
    }
    
    // 按文件夹名称排序子文件夹
    childFolders.sort((a, b) => {
      const aName = a.split('/').pop();
      const bName = b.split('/').pop();
      return aName.localeCompare(bName, 'zh-CN');
    });
    
    // 构建子节点
    for (const childPath of childFolders) {
      const childNode = buildTree(childPath);
      node.children.push(childNode);
    }
    
    return node;
  };
  
  // 获取顶级文件夹
  const topLevelFolders = new Set();
  for (const folderPath of folderMap.keys()) {
    const parts = folderPath.split('/');
    if (parts.length === 1) {
      // 顶级文件夹
      topLevelFolders.add(folderPath);
    } else {
      // 检查父文件夹是否存在
      const parentFolder = parts.slice(0, -1).join('/');
      if (!folderMap.has(parentFolder)) {
        // 父文件夹不存在，这是一个顶级文件夹
        topLevelFolders.add(folderPath);
      }
    }
  }
  
  // 按文件夹名称排序顶级文件夹
  const sortedTopLevelFolders = Array.from(topLevelFolders).sort((a, b) => {
    const aName = a.split('/').pop();
    const bName = b.split('/').pop();
    return aName.localeCompare(bName, 'zh-CN');
  });
  
  // 构建树形结构
  const tree = [];
  for (const folderPath of sortedTopLevelFolders) {
    tree.push(buildTree(folderPath));
  }
  
  return tree;
}

// 主函数
function main() {
  try {
    console.log('检查文章文件变化...');
    
    // 检查是否有文件变化
    if (!hasFileChanges()) {
      console.log('✅ 文章文件无变化，跳过生成');
      return;
    }
    
    console.log('开始扫描文章文件夹...');
    
    // 扫描所有文章
    const articles = scanArticles(ARTICLES_DIR);
    
    // 生成文件夹树
    const folderTree = generateFolderTree(articles);
    
    // 生成输出数据（只包含元数据，不包含文章内容）
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
    
    // 更新缓存
    updateCache(articles);
    
    console.log(`✅ 成功生成文章元数据：`);
    console.log(`- 文章数量: ${articles.length}`);
    console.log(`- 文件夹数量: ${folderTree.length}`);
    console.log(`- 输出文件: ${OUTPUT_FILE}`);
    console.log(`- 注意: 文章内容将通过 HTTP 请求动态加载`);
    
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