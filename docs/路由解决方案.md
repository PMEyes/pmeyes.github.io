# 路由问题解决方案

## 问题描述

在单页应用（SPA）中，当用户直接访问文章详情页面的URL或刷新页面时，会出现404错误。这是因为：

1. **前端路由**：React Router使用前端路由，URL路径不会对应服务器上的实际文件
2. **服务器查找**：当用户直接访问 `/article/slug` 时，服务器会查找对应的文件，但找不到
3. **刷新问题**：刷新页面时，浏览器会向服务器请求该路径，导致404

## 解决方案

### 方案1：使用HashRouter（已实施）

**优点**：
- 简单可靠，无需服务器配置
- 兼容性好，所有服务器都支持
- 刷新页面不会出现404

**缺点**：
- URL中包含 `#` 符号
- SEO不如BrowserRouter友好

**实施**：
```tsx
import { HashRouter as Router } from 'react-router-dom';
```

### 方案2：服务器配置重写规则

**优点**：
- 保持干净的URL
- SEO友好
- 用户体验更好

**缺点**：
- 需要服务器配置
- 不同部署平台配置不同

**配置示例**：

#### Vercel部署
```json
// vercel.json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### Netlify部署
```toml
# _redirects
/*    /index.html   200
```

#### Nginx配置
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

#### Apache配置
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## 当前实施

我们选择了**HashRouter**方案，因为：

1. **简单可靠**：无需复杂的服务器配置
2. **开发友好**：开发环境直接可用
3. **部署简单**：任何静态文件服务器都支持
4. **兼容性好**：所有浏览器都支持

## URL格式

使用HashRouter后，URL格式变为：
- 首页：`/#/`
- 文章列表：`/#/articles`
- 文章详情：`/#/article/slug`
- 关于页面：`/#/about`

## 未来优化

如果将来需要更好的SEO和用户体验，可以考虑：

1. **服务器端渲染（SSR）**
2. **静态站点生成（SSG）**
3. **配置服务器重写规则**

## 测试方法

1. 启动开发服务器：`npm run dev`
2. 访问文章详情页面
3. 刷新页面，确认不会出现404
4. 直接访问文章URL，确认能正常显示 