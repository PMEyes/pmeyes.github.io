import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 文章文件夹路径
const ARTICLES_DIR = path.join(__dirname, '../articles');
const ARTICLES_JSON_DIR = path.join(__dirname, '../data/articles-json');
const DATA_ASSETS_DIR = path.join(__dirname, '../data/assets');
const CACHE_FILE = path.join(__dirname, '../data/.articles-cache.json');

// 作为静态资源复制的扩展名（图片等）
const ASSET_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.bmp', '.ico']);

// 计算文件哈希值
function calculateFileHash(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return crypto.createHash('md5').update(content).digest('hex');
}

// 获取文件修改时间
function getFileMtime(filePath) {
  return fs.statSync(filePath).mtime.getTime();
}

// 检查是否需要转换
function needsConversion() {
  try {
    // 如果缓存文件不存在，需要重新转换
    if (!fs.existsSync(CACHE_FILE)) {
      console.log('缓存文件不存在，需要重新转换文章');
      return true;
    }

    // 如果 JSON 目录不存在，需要转换
    if (!fs.existsSync(ARTICLES_JSON_DIR)) {
      console.log('JSON 目录不存在，需要重新转换文章');
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
    
    // 检查 JSON 文件是否都存在
    const jsonFiles = fs.readdirSync(ARTICLES_JSON_DIR).filter(file => file.endsWith('.json'));
    const expectedJsonFiles = currentFiles
      .filter(file => file.endsWith('.md') && !file.endsWith('README.md'))
      .map(file => {
        const content = fs.readFileSync(file, 'utf-8');
        const { data } = matter(content);
        const slug = data.slug || path.basename(file, '.md');
        return `${slug}.json`;
      });
    
    for (const expectedFile of expectedJsonFiles) {
      if (!jsonFiles.includes(expectedFile)) {
        console.log(`缺少 JSON 文件: ${expectedFile}`);
        return true;
      }
    }
    
    console.log('文章文件无变化，跳过转换');
    return false;
    
  } catch (error) {
    console.log('检查文件变化时出错，重新转换文章');
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

/**
 * 从 Markdown 内容中提取相对路径的图片/资源引用
 * 匹配 ![alt](url) 中的 url 为相对路径（./ 或非 http(s): 开头）
 */
function extractRelativeAssetRefs(content) {
  const refs = [];
  // 匹配 ![alt](url) 中的 url
  const imageRegex = /!\[([^\]]*)\]\(\s*([^)\s]+)\s*\)/g;
  let m;
  while ((m = imageRegex.exec(content)) !== null) {
    const url = m[2].trim();
    if (url.startsWith('./') || url.startsWith('../') || (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/') && !url.startsWith('data:'))) {
      refs.push({ full: m[0], url });
    }
  }
  return refs;
}

/**
 * 将文章内容中的相对资源路径替换为 /data/assets/... 并复制文件到 data/assets
 * @param {string} markdownContent - 原始 markdown 内容
 * @param {string} articleDirRelative - 文章所在目录相对于 articles 的路径，如 "高项学习/第四天"
 * @returns {{ content: string, copiedCount: number }}
 */
function processContentAssets(markdownContent, articleDirRelative) {
  const refs = extractRelativeAssetRefs(markdownContent);
  let content = markdownContent;
  let copiedCount = 0;
  const articleDirFull = path.join(ARTICLES_DIR, articleDirRelative);

  for (const { full, url } of refs) {
    try {
      const decodedUrl = decodeURIComponent(url);
      const localPath = path.normalize(path.join(articleDirFull, decodedUrl.replace(/^\.\//, '')));
      if (!fs.existsSync(localPath)) continue;

      const ext = path.extname(localPath).toLowerCase();
      if (!ASSET_EXTENSIONS.has(ext)) continue;

      const fileName = path.basename(localPath);
      const assetRelativePath = path.join(articleDirRelative, fileName).split(path.sep).join('/');
      const destPath = path.join(DATA_ASSETS_DIR, assetRelativePath);
      const destDir = path.dirname(destPath);

      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      fs.copyFileSync(localPath, destPath);
      copiedCount++;

      const dataUrl = '/data/assets/' + assetRelativePath.split('/').map(encodeURIComponent).join('/');
      const newFull = full.replace(url, dataUrl);
      content = content.replace(full, newFull);
    } catch (e) {
      console.warn('处理资源引用失败:', url, e.message);
    }
  }

  return { content, copiedCount };
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
      const filePathRelative = path.relative(ARTICLES_DIR, fullPath);
      const articleDirRelative = path.dirname(filePathRelative);

      // 将内容中的相对图片/资源复制到 data/assets 并改写引用为 /data/assets/...
      const { content: processedContent } = processContentAssets(markdownContent, articleDirRelative);

      // 生成完整的文章 JSON 文件（使用改写后的 content，图片等指向 data 目录）
      const articleJson = {
        id: slug,
        title: data.title || path.basename(item, '.md'),
        excerpt: data.excerpt || markdownContent.substring(0, 150) + '...',
        publishedAt: data.publishedAt || new Date().toISOString().split('T')[0],
        tags: data.tags || [],
        slug: slug,
        readingTime: data.readingTime || readingTime,
        folder: folder,
        filePath: filePathRelative,
        content: processedContent,
        rawContent: content // 包含 front matter 的原始内容
      };

      articles.push({
        filePath: fullPath,
        slug: slug,
        articleJson: articleJson
      });
    }
  }
  
  return articles;
}

// 主函数
function main() {
  try {
    console.log('检查文章文件变化...');
    
    // 检查是否需要转换
    if (!needsConversion()) {
      console.log('✅ 文章文件无变化，跳过转换');
      return;
    }
    
    console.log('开始转换 Markdown 文件为 JSON...');
    
    // 确保输出目录存在
    if (!fs.existsSync(ARTICLES_JSON_DIR)) {
      fs.mkdirSync(ARTICLES_JSON_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_ASSETS_DIR)) {
      fs.mkdirSync(DATA_ASSETS_DIR, { recursive: true });
    }

    // 扫描所有文章（会同时复制图片等静态资源到 data/assets 并改写引用）
    const articles = scanArticles(ARTICLES_DIR);
    
    let convertedCount = 0;
    
    // 转换每个文章为 JSON 文件
    for (const article of articles) {
      const articleJsonPath = path.join(ARTICLES_JSON_DIR, `${article.slug}.json`);
      fs.writeFileSync(articleJsonPath, JSON.stringify(article.articleJson, null, 2));
      console.log(`✅ 已转换: ${article.slug}.json`);
      convertedCount++;
    }
    
    // 更新缓存
    updateCache(articles);

    console.log(`\n🎉 转换完成！`);
    console.log(`- 转换文件数量: ${convertedCount}`);
    console.log(`- 输出目录: ${ARTICLES_JSON_DIR}`);
    console.log(`- 文件列表:`);
    articles.forEach(article => {
      console.log(`  - ${article.slug}.json`);
    });
    
  } catch (error) {
    console.error('转换文章时出错:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
main(); 