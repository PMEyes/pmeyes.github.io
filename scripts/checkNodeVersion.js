#!/usr/bin/env node

/**
 * Node.js 版本检查脚本
 * 检查当前 Node.js 版本是否符合项目要求
 * 如果版本不符合，提供升级指南
 */

import semver from 'semver';

// 项目要求的最低 Node.js 版本
const MIN_NODE_VERSION = '22.12.0';
const RECOMMENDED_NODE_VERSION = '22.12.0';

/**
 * 显示升级提示
 */
function showUpgradeHint() {
  console.log('\n📖 详细升级指南请查看：docs/NodeJS升级指南.md');
  console.log('🔗 或访问：https://nodejs.org/ 下载最新版本');
}

function checkNodeVersion() {
  const currentNodeVersion = process.version;
  const nodeVersion = currentNodeVersion.replace('v', '');
  
  console.log(`当前 Node.js 版本: ${currentNodeVersion}`);
  console.log(`要求的最低版本: ${MIN_NODE_VERSION}`);
  
  // 检查版本是否满足最低要求
  if (!semver.gte(nodeVersion, MIN_NODE_VERSION)) {
    console.error('\n❌ Node.js 版本过低！');
    console.error(`当前版本: ${currentNodeVersion}`);
    console.error(`要求版本: >= ${MIN_NODE_VERSION}`);
    
    console.log('\n💡 快速升级方式：');
    console.log('   nvm install 22 && nvm use 22');
    console.log('   或访问：https://nodejs.org/');
    
    showUpgradeHint();
    process.exit(1);
  }
  
  // 检查是否使用推荐版本
  if (semver.lt(nodeVersion, RECOMMENDED_NODE_VERSION)) {
    console.warn('\n⚠️  建议使用更新的 Node.js 版本');
    console.warn(`当前版本: ${currentNodeVersion}`);
    console.warn(`推荐版本: >= ${RECOMMENDED_NODE_VERSION}`);
    console.warn('虽然可以运行，但建议升级以获得更好的性能和兼容性\n');
  }
  
  console.log('✅ Node.js 版本检查通过\n');
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  checkNodeVersion();
}

export { checkNodeVersion, showUpgradeHint }; 