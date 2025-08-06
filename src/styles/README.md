# 样式模块化结构说明

## 概述

本项目采用模块化的SCSS结构，将原来的 `global.scss` 文件拆分成多个独立的模块文件，以提高代码的可维护性和复用性。

## 文件结构

```
src/styles/
├── main.scss          # 主入口文件，导入所有模块
├── variables.scss     # CSS变量和SCSS变量定义
├── mixins.scss       # 可复用的混合器
├── reset.scss        # 基础重置样式
├── base.scss         # 基础组件样式（按钮、卡片、输入框等）
├── utilities.scss    # 工具类样式
└── pages.scss        # 页面特定样式
```

## 模块说明

### variables.scss
- 包含所有CSS变量定义（`:root` 选择器）
- 包含所有SCSS变量定义
- 定义颜色、间距、阴影、过渡等变量

### mixins.scss
- 布局混合器：`flex-center`、`flex-between`
- 响应式混合器：`responsive`
- 组件混合器：`button-base`、`card-base`

### reset.scss
- 基础样式重置
- HTML和body基础样式
- 列表样式重置

### base.scss
- 容器样式：`.container`
- 按钮样式：`.button`
- 卡片样式：`.card`
- 输入框样式：`.input`
- 标签样式：`.tag`
- 网格系统：`.grid`
- 加载动画：`.loading`

### utilities.scss
- 文本对齐工具类
- 间距工具类
- 显示工具类
- 尺寸工具类
- 响应式工具类

## 使用方式

### 按需引入
每个组件或页面应该按需引入所需的模块：

```scss
// 只使用变量
@use '../../styles/variables' as *;

// 使用变量和混合器
@use '../../styles/variables' as *;
@use '../../styles/mixins' as *;

// 使用所有基础样式（不推荐，会增加包体积）
@use '../../styles/main' as *;
```

### 推荐引入方式

根据文件的实际需求选择合适的模块：

1. **只使用变量**：引入 `variables`
2. **使用变量和混合器**：引入 `variables` 和 `mixins`
3. **使用基础组件**：引入 `variables`、`mixins` 和 `base`
4. **使用工具类**：引入 `variables` 和 `utilities`

## 优势

1. **按需加载**：只引入需要的样式模块，减少包体积
2. **更好的维护性**：样式按功能分类，便于维护
3. **提高复用性**：混合器和变量可以独立使用
4. **清晰的依赖关系**：每个文件的依赖关系更加明确

## 注意事项

1. 避免在组件中引入 `main.scss`，应该按需引入具体模块
2. 新增样式时，应该放在合适的模块文件中
3. 修改全局变量时，只需要修改 `variables.scss`
4. 新增混合器时，应该放在 `mixins.scss` 中 