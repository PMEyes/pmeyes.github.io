import { Language, LocaleData, LocaleVariables } from '@/types';
import { DEFAULT_LANGUAGE, STORAGE_KEYS } from '@/constants';

// 直接导入语言文件
import zhCNLocale from '@/locales/zh-CN.json';
import enUSLocale from '@/locales/en-US.json';

// 语言文件缓存
const localeCache: Record<Language, LocaleData> = {
  'zh-CN': zhCNLocale,
  'en-US': enUSLocale,
} as Record<Language, LocaleData>;

// 加载状态
let isInitialized = false;

class LanguageService {
  private currentLanguage: Language = DEFAULT_LANGUAGE;

  constructor() {
    this.loadLanguageFromStorage();
    // 初始化时预加载当前语言
    this.initializeCurrentLanguage();
  }

  private loadLanguageFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      if (stored && this.isValidLanguage(stored)) {
        this.currentLanguage = stored as Language;
      }
    } catch (error) {
      console.warn('Failed to load language from storage:', error);
    }
  }

  private isValidLanguage(lang: string): lang is Language {
    return ['zh-CN', 'en-US'].includes(lang);
  }

  // 初始化当前语言
  private async initializeCurrentLanguage(): Promise<void> {
    if (isInitialized) return;
    
    try {
      // 语言文件已经通过导入加载，无需额外操作
      isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize current language:', error);
    }
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  async setLanguage(language: Language): Promise<void> {
    if (!this.isValidLanguage(language)) {
      throw new Error(`Unsupported language: ${language}`);
    }

    this.currentLanguage = language;
    
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
      // 预加载新语言文件
      // 语言文件已经通过导入加载，无需额外操作
    } catch (error) {
      console.warn('Failed to save language to storage:', error);
    }
  }

  /**
   * 获取文本，支持变量替换（同步版本，优先使用缓存）
   * @param key 语言键
   * @param variables 可选的变量对象
   * @returns 替换变量后的文本
   */
  getText(key: string, variables?: LocaleVariables): string {
    const locale = localeCache[this.currentLanguage];
    let text = locale?.[key] || key;
    
    if (variables) {
      text = this.replaceVariables(text, variables);
    }
    
    return text;
  }

  /**
   * 异步获取文本（用于确保语言文件已加载）
   * @param key 语言键
   * @param variables 可选的变量对象
   * @returns 替换变量后的文本
   */
  async getTextAsync(key: string, variables?: LocaleVariables): Promise<string> {
    // 确保语言文件已加载
    // 语言文件已经通过导入加载，无需额外操作
    
    return this.getText(key, variables);
  }

  /**
   * 替换文本中的变量
   * @param text 包含变量的文本
   * @param variables 变量对象
   * @returns 替换后的文本
   */
  private replaceVariables(text: string, variables: LocaleVariables): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
      return variables[variableName]?.toString() || match;
    });
  }

  getLocaleData(): LocaleData {
    return localeCache[this.currentLanguage] || {};
  }

  async getLocaleDataAsync(): Promise<LocaleData> {
    // 语言文件已经通过导入加载，无需额外操作
    return localeCache[this.currentLanguage];
  }

  async getAllLocales(): Promise<Record<Language, LocaleData>> {
    // 预加载所有语言文件
    // 语言文件已经通过导入加载，无需额外操作
    
    return localeCache;
  }

  // 预加载所有语言文件
  async preloadAllLocales(): Promise<void> {
    if (isInitialized) return;
    
    try {
      // 语言文件已经通过导入加载，无需额外操作
      isInitialized = true;
    } catch (error) {
      console.error('Failed to preload locales:', error);
    }
  }

  // 检查是否已加载
  isLoaded(): boolean {
    return !!localeCache[this.currentLanguage];
  }
}

export const languageService = new LanguageService();
export default languageService; 