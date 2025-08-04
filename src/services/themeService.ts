import { Theme, ThemeConfig } from '@/types';
import { themes, defaultTheme } from '@/constants/themes';
import { languageService } from './languageService';

class ThemeService {
  private readonly THEME_STORAGE_KEY = 'pmeyes_theme';

  getCurrentTheme(): Theme {
    const savedTheme = localStorage.getItem(this.THEME_STORAGE_KEY);
    return (savedTheme as Theme) || defaultTheme;
  }

  setTheme(theme: Theme): void {
    localStorage.setItem(this.THEME_STORAGE_KEY, theme);
    this.applyTheme(theme);
  }

  getThemeConfig(theme: Theme): ThemeConfig {
    return themes[theme] || themes[defaultTheme];
  }

  getAllThemes(): Record<string, ThemeConfig> {
    return themes;
  }

  applyTheme(theme: Theme): void {
    const themeConfig = this.getThemeConfig(theme);
    const root = document.documentElement;

    // 应用CSS变量
    Object.entries(themeConfig.colors).forEach(([key, value]) => {
      const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVarName, value);
    });

    // 添加主题类名到body
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme}`);
  }

  // 初始化主题
  initializeTheme(): void {
    const currentTheme = this.getCurrentTheme();
    this.applyTheme(currentTheme);
  }

  // 获取主题列表（用于选择器）
  getThemeList(): Array<{ key: string; config: ThemeConfig }> {
    return Object.entries(themes).map(([key, config]) => ({
      key,
      config,
    }));
  }

  // 获取支持多语言的主题列表
  getLocalizedThemeList(): Array<{ key: string; config: ThemeConfig }> {
    return Object.entries(themes).map(([key, config]) => {
      const localizedConfig = {
        ...config,
        name: this.getLocalizedThemeName(key as Theme),
        description: this.getLocalizedThemeDescription(key as Theme),
        mood: this.getLocalizedThemeMood(key as Theme),
      };
      
      return {
        key,
        config: localizedConfig,
      };
    });
  }

  // 获取本地化的主题名称
  private getLocalizedThemeName(theme: Theme): string {
    const themeKey = theme.toUpperCase();
    return languageService.getText(`THEME_${themeKey}_NAME`);
  }

  // 获取本地化的主题描述
  private getLocalizedThemeDescription(theme: Theme): string {
    const themeKey = theme.toUpperCase();
    return languageService.getText(`THEME_${themeKey}_DESCRIPTION`);
  }

  // 获取本地化的主题心情
  private getLocalizedThemeMood(theme: Theme): string {
    const themeKey = theme.toUpperCase();
    return languageService.getText(`THEME_${themeKey}_MOOD`);
  }
}

export const themeService = new ThemeService(); 