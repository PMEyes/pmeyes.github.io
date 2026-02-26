/**
 * 将 data/assets 下的图片压缩到 10KB 以内（部署前执行）
 * 支持格式：PNG、JPEG、WebP（GIF/SVG 跳过）
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_ASSETS_DIR = path.join(__dirname, '../data/assets');
const ARTICLES_JSON_DIR = path.join(__dirname, '../data/articles-json');
const TARGET_MAX_BYTES = 10 * 1024; // 10KB

const COMPRESS_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

function dataAssetUrl(relativePath) {
  return '/data/assets/' + relativePath.split(path.sep).map(encodeURIComponent).join('/');
}

function updateArticleJsonReferences(oldRel, newRel) {
  if (oldRel === newRel) return;
  const oldUrl = dataAssetUrl(oldRel);
  const newUrl = dataAssetUrl(newRel);
  if (!fs.existsSync(ARTICLES_JSON_DIR)) return;
  const files = fs.readdirSync(ARTICLES_JSON_DIR).filter((f) => f.endsWith('.json'));
  for (const f of files) {
    const fp = path.join(ARTICLES_JSON_DIR, f);
    let s = fs.readFileSync(fp, 'utf-8');
    if (s.includes(oldUrl)) {
      s = s.split(oldUrl).join(newUrl);
      fs.writeFileSync(fp, s);
    }
  }
}

function getAllImagePaths(dir, base = '') {
  const list = [];
  if (!fs.existsSync(dir)) return list;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relPath = path.join(base, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      list.push(...getAllImagePaths(fullPath, relPath));
    } else if (COMPRESS_EXTENSIONS.has(path.extname(item).toLowerCase())) {
      list.push(fullPath);
    }
  }
  return list;
}

/**
 * 仅做质量压缩，不改变图片尺寸；尽量压到 ≤10KB
 */
async function compressToTarget(inputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  const originalSize = fs.statSync(inputPath).size;

  if (originalSize <= TARGET_MAX_BYTES) {
    return { path: inputPath, before: originalSize, after: originalSize, skipped: true };
  }

  let buffer = null;
  let usedFormat = ext.slice(1);

  // 不 resize，只调质量/压缩等级，保持原图尺寸
  if (ext === '.png') {
    buffer = await sharp(inputPath).png({ compressionLevel: 9 }).toBuffer();
    usedFormat = 'png';
    if (buffer.length > TARGET_MAX_BYTES) {
      const webp = await sharp(inputPath).webp({ quality: 80 }).toBuffer();
      if (webp.length < buffer.length) {
        buffer = webp;
        usedFormat = 'webp';
      }
    }
    if (buffer.length > TARGET_MAX_BYTES) {
      const jpeg = await sharp(inputPath).jpeg({ quality: 85 }).toBuffer();
      if (jpeg.length < buffer.length) {
        buffer = jpeg;
        usedFormat = 'jpeg';
      }
    }
  } else if (ext === '.jpg' || ext === '.jpeg') {
    for (const q of [85, 75, 65, 55]) {
      buffer = await sharp(inputPath).jpeg({ quality: q }).toBuffer();
      if (buffer.length <= TARGET_MAX_BYTES) break;
    }
  } else if (ext === '.webp') {
    for (const q of [80, 70, 60, 50]) {
      buffer = await sharp(inputPath).webp({ quality: q }).toBuffer();
      if (buffer.length <= TARGET_MAX_BYTES) break;
    }
  }

  if (!buffer) {
    return { path: inputPath, before: originalSize, after: originalSize, skipped: true };
  }

  const outExt = usedFormat === 'jpeg' ? '.jpg' : usedFormat === 'png' ? '.png' : '.webp';
  const outPath =
    outExt !== ext ? inputPath.replace(new RegExp(`${path.extname(inputPath)}$`, 'i'), outExt) : inputPath;
  const oldRel = path.relative(DATA_ASSETS_DIR, inputPath);
  const newRel = path.relative(DATA_ASSETS_DIR, outPath);

  fs.writeFileSync(outPath, buffer);
  if (outPath !== inputPath && fs.existsSync(inputPath)) {
    fs.unlinkSync(inputPath);
    updateArticleJsonReferences(oldRel, newRel);
  }

  return { path: outPath, before: originalSize, after: buffer.length, skipped: false };
}

async function main() {
  const images = getAllImagePaths(DATA_ASSETS_DIR);
  if (images.length === 0) {
    console.log('✅ data/assets 下无待压缩图片');
    return;
  }

  console.log(`开始压缩图片（目标 ≤${TARGET_MAX_BYTES / 1024}KB），共 ${images.length} 个文件...`);
  let totalBefore = 0;
  let totalAfter = 0;

  for (const p of images) {
    try {
      const r = await compressToTarget(p);
      totalBefore += r.before;
      totalAfter += r.after;
      const rel = path.relative(DATA_ASSETS_DIR, r.path);
      if (r.skipped) {
        console.log(`  ⏭ ${rel} (已 ≤10KB)`);
      } else {
        const pct = ((1 - r.after / r.before) * 100).toFixed(0);
        const over = r.after > TARGET_MAX_BYTES ? ' ⚠ 仍超过 10KB' : '';
        console.log(`  ✓ ${rel} ${(r.before / 1024).toFixed(1)}KB → ${(r.after / 1024).toFixed(1)}KB (-${pct}%)${over}`);
      }
    } catch (e) {
      console.warn(`  ✗ ${path.relative(DATA_ASSETS_DIR, p)}: ${e.message}`);
    }
  }

  const saved = totalBefore - totalAfter;
  const pct = totalBefore > 0 ? ((saved / totalBefore) * 100).toFixed(1) : 0;
  console.log(`\n✅ 压缩完成：${(totalBefore / 1024).toFixed(1)}KB → ${(totalAfter / 1024).toFixed(1)}KB，节省 ${(saved / 1024).toFixed(1)}KB (${pct}%)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
