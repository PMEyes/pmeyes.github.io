# LoadingAnimation 组件

## 功能特性

- 🎨 **主题色一致**: 自动适配当前主题色
- 🌍 **多语言支持**: 支持中英文切换
- 👁️ **眼睛图标**: 独特的眼睛动画效果
- 💬 **励志文案**: 轮播显示项目管理相关的励志语句
- 📱 **响应式设计**: 适配移动端和桌面端
- ⚡ **流畅动画**: 使用CSS动画实现流畅的视觉效果

## 使用方法

```tsx
import LoadingAnimation from '@/components/LoadingAnimation/LoadingAnimation';

// 在组件中使用
<LoadingAnimation 
  getText={(key: string) => languageService.getText(key)}
  theme={currentTheme}
/>
```

## Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| getText | (key: string) => string | 是 | 获取多语言文本的函数 |
| theme | string | 是 | 当前主题名称 |

## 动画效果

1. **眼睛眨动**: 眼睛图标会定期眨动
2. **瞳孔转动**: 瞳孔会随机转动，模拟真实眼睛
3. **闪烁效果**: 眼睛上的高光会闪烁
4. **文案轮播**: 励志文案每3秒切换一次
5. **加载点动画**: 底部的三个点会依次闪烁

## 多语言文案

组件会自动根据当前语言显示相应的文案：

### 中文文案
- 每一个项目都是一次成长的机会
- 用专业的眼光看待每一个挑战
- 项目管理是一门艺术，也是一门科学
- 细节决定成败，态度决定高度
- 成功的项目背后都有不为人知的努力
- 用智慧的眼睛发现项目中的机遇
- 每一次失败都是通往成功的阶梯
- 项目管理者的眼光决定项目的未来

### 英文文案
- Every project is an opportunity for growth
- View every challenge with professional eyes
- Project management is both an art and a science
- Details determine success, attitude determines height
- Behind every successful project lies unseen effort
- Use wise eyes to discover opportunities in projects
- Every failure is a step toward success
- A project manager's vision determines the project's future

## 主题适配

组件会自动适配以下主题：
- default (默认主题)
- sunny (阳光主题)
- calm (宁静主题)
- energetic (活力主题)
- cozy (温馨主题)
- professional (专业主题)
- day (白天主题)
- night (夜间主题)

## 测试页面

访问 `/loading-test` 路由可以测试加载动画效果。 