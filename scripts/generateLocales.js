import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_LOCALES_DIR = path.join(__dirname, '../src/locales');
const DATA_LOCALES_DIR = path.join(__dirname, '../data/locales');
const CACHE_FILE = path.join(__dirname, '../data/.locales-cache.json');

// 确保目标目录存在
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 读取JSON文件
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return {};
  }
}

// 写入JSON文件
function writeJsonFile(filePath, data) {
  try {
    const content = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Generated: ${filePath}`);
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error.message);
  }
}

// 计算文件内容的哈希值
function calculateFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return crypto.createHash('md5').update(content).digest('hex');
  } catch (error) {
    return null;
  }
}

// 读取缓存文件
function readCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const content = fs.readFileSync(CACHE_FILE, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.warn('Failed to read cache file:', error.message);
  }
  return {};
}

// 写入缓存文件
function writeCache(cache) {
  try {
    ensureDirectoryExists(path.dirname(CACHE_FILE));
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
  } catch (error) {
    console.warn('Failed to write cache file:', error.message);
  }
}

// 检查文件是否有变化
function hasFileChanged(filePath, cache) {
  const currentHash = calculateFileHash(filePath);
  const cachedHash = cache[filePath];
  
  if (!cachedHash) {
    return true; // 文件不在缓存中，认为有变化
  }
  
  return currentHash !== cachedHash;
}

// 检查是否需要重新生成
function needsRegeneration() {
  const cache = readCache();
  
  // 检查源文件是否有变化
  const zhSrcPath = path.join(SRC_LOCALES_DIR, 'zh-CN.json');
  const enSrcPath = path.join(SRC_LOCALES_DIR, 'en-US.json');
  
  const zhChanged = hasFileChanged(zhSrcPath, cache);
  const enChanged = hasFileChanged(enSrcPath, cache);
  
  // 检查目标目录是否存在
  const dataLocalesExists = fs.existsSync(DATA_LOCALES_DIR);
  
  if (!dataLocalesExists) {
    console.log('📁 data/locales 目录不存在，需要生成');
    return true;
  }
  
  if (zhChanged || enChanged) {
    console.log('📝 检测到多语言文件变化:');
    if (zhChanged) console.log('   - zh-CN.json 已修改');
    if (enChanged) console.log('   - en-US.json 已修改');
    return true;
  }
  
  console.log('✅ 多语言文件无变化，跳过生成');
  return false;
}

// 更新缓存
function updateCache() {
  const cache = {};
  
  const zhSrcPath = path.join(SRC_LOCALES_DIR, 'zh-CN.json');
  const enSrcPath = path.join(SRC_LOCALES_DIR, 'en-US.json');
  
  cache[zhSrcPath] = calculateFileHash(zhSrcPath);
  cache[enSrcPath] = calculateFileHash(enSrcPath);
  
  writeCache(cache);
}

// 生成缺失的英文翻译
function generateMissingTranslations(zhData, enData) {
  const result = { ...enData };
  
  for (const [key, zhValue] of Object.entries(zhData)) {
    if (!result[key]) {
      // 生成默认的英文翻译
      result[key] = generateDefaultTranslation(key, zhValue);
    }
  }
  
  return result;
}

// 生成默认翻译（简单的占位符）
function generateDefaultTranslation(key, zhValue) {
  // 如果中文值包含占位符，保持占位符格式
  if (typeof zhValue === 'string' && zhValue.includes('{{')) {
    return `[EN] ${zhValue}`;
  }
  
  // 根据key的命名规则生成默认翻译
  if (key.includes('_DESCRIPTION')) {
    return `[EN] ${zhValue}`;
  }
  
  if (key.includes('_NAME')) {
    return `[EN] ${zhValue}`;
  }
  
  if (key.includes('_MOOD')) {
    return `[EN] ${zhValue}`;
  }
  
  // 默认处理
  return `[EN] ${zhValue}`;
}

// 主函数
function generateLocales() {
  console.log('🌐 Checking locales...');
  
  // 检查是否需要重新生成
  if (!needsRegeneration()) {
    return;
  }
  
  console.log('🔄 Generating locales...');
  
  // 确保目标目录存在
  ensureDirectoryExists(DATA_LOCALES_DIR);
  
  // 读取中文文件
  const zhFilePath = path.join(SRC_LOCALES_DIR, 'zh-CN.json');
  const zhData = readJsonFile(zhFilePath);
  
  // 读取英文文件
  const enFilePath = path.join(SRC_LOCALES_DIR, 'en-US.json');
  const enData = readJsonFile(enFilePath);
  
  // 生成完整的英文翻译
  const completeEnData = generateMissingTranslations(zhData, enData);
  
  // 写入文件到data目录
  writeJsonFile(path.join(DATA_LOCALES_DIR, 'zh-CN.json'), zhData);
  writeJsonFile(path.join(DATA_LOCALES_DIR, 'en-US.json'), completeEnData);
  
  // 更新缓存
  updateCache();
  
  console.log('✅ Locales generation completed!');
  
  // 输出统计信息
  const zhKeys = Object.keys(zhData);
  const enKeys = Object.keys(completeEnData);
  const missingKeys = zhKeys.filter(key => !enData[key]);
  
  console.log(`📊 Statistics:`);
  console.log(`   - Chinese keys: ${zhKeys.length}`);
  console.log(`   - English keys: ${enKeys.length}`);
  console.log(`   - Missing translations: ${missingKeys.length}`);
  
  if (missingKeys.length > 0) {
    console.log(`   - Missing keys: ${missingKeys.join(', ')}`);
  }
}

// 监听文件变化（用于开发模式）
function watchLocales() {
  console.log('👀 Watching for locale file changes...');
  
  const zhSrcPath = path.join(SRC_LOCALES_DIR, 'zh-CN.json');
  const enSrcPath = path.join(SRC_LOCALES_DIR, 'en-US.json');
  
  // 检查文件是否存在
  if (!fs.existsSync(zhSrcPath) || !fs.existsSync(enSrcPath)) {
    console.error('❌ Locale files not found in src/locales/');
    return;
  }
  
  // 监听文件变化
  fs.watch(SRC_LOCALES_DIR, (eventType, filename) => {
    if (filename && (filename === 'zh-CN.json' || filename === 'en-US.json')) {
      console.log(`📝 Detected change in ${filename}`);
      generateLocales();
    }
  });
  
  console.log('✅ Watching enabled. Press Ctrl+C to stop.');
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.includes('--watch') || args.includes('-w')) {
    // 开发模式：监听文件变化
    generateLocales(); // 先执行一次
    watchLocales();
  } else {
    // 正常模式：只执行一次
    generateLocales();
  }
}

export default generateLocales; 