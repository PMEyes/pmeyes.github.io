import { Language, LocaleData, LocaleVariables } from '@/types';
import { DEFAULT_LANGUAGE, STORAGE_KEYS } from '@/constants';
import { store } from '@/store';
import { setLoading, setError } from '@/store/slices/appSlice';

// 语言文件缓存
const localeCache: Record<Language, LocaleData> = {} as Record<Language, LocaleData>;

// 加载状态
let isInitialized = false;

// 防止重复初始化的标志
let isInitializing = false;

class LanguageService {
  private currentLanguage: Language = DEFAULT_LANGUAGE;

  constructor() {
    this.loadLanguageFromStorage();
    // 不在构造函数中自动初始化，由外部控制
    // this.initializeCurrentLanguage();
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

  // 使用 httpService 从 /data/locales 加载语言文件
  async loadLocaleData(language: Language): Promise<LocaleData> {
    // 如果已经缓存了，直接返回
    if (localeCache[language]) {
      console.log(`Using cached locale data for ${language}`);
      return localeCache[language];
    }

    try {
      // 设置加载状态
      store.dispatch(setLoading(true));
      store.dispatch(setError(null));

      console.log(`Loading locale data for ${language}...`);
      
      // 直接使用 fetch 获取 JSON 文件，因为语言包是静态文件
      const response = await fetch(`/data/locales/${language}.json`);
      
      if (!response.ok) {
        throw new Error(`Failed to load locale data for ${language}: ${response.statusText}`);
      }
      
      const data = await response.json();
      localeCache[language] = data;
      console.log(`Successfully loaded locale data for ${language} (${Object.keys(data).length} keys)`);
      return data;
    } catch (error) {
      console.error(`Failed to load locale data for ${language}:`, error);
      store.dispatch(setError(`Failed to load language pack for ${language}`));
      return {};
    } finally {
      store.dispatch(setLoading(false));
    }
  }

  // 初始化当前语言
  async initializeCurrentLanguage(): Promise<void> {
    if (isInitialized) {
      console.log('Language service already initialized');
      return;
    }

    if (isInitializing) {
      console.log('Language service is already initializing, waiting...');
      // 等待初始化完成
      while (isInitializing) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      return;
    }
    
    try {
      isInitializing = true;
      console.log('Initializing language service...');
      await this.loadLocaleData(this.currentLanguage);
      isInitialized = true;
      console.log('Language service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize current language:', error);
    } finally {
      isInitializing = false;
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
      // 重新获取新语言的服务包
      await this.loadLocaleData(language);
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
    if (!localeCache[this.currentLanguage]) {
      await this.loadLocaleData(this.currentLanguage);
    }
    
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
    if (!localeCache[this.currentLanguage]) {
      await this.loadLocaleData(this.currentLanguage);
    }
    return localeCache[this.currentLanguage];
  }

  async getAllLocales(): Promise<Record<Language, LocaleData>> {
    // 预加载所有语言文件
    const languages: Language[] = ['zh-CN', 'en-US'];
    await Promise.all(
      languages.map(async (lang) => {
        if (!localeCache[lang]) {
          await this.loadLocaleData(lang);
        }
      })
    );
    
    return localeCache;
  }

  // 预加载所有语言文件
  async preloadAllLocales(): Promise<void> {
    if (isInitialized) return;
    
    try {
      const languages: Language[] = ['zh-CN', 'en-US'];
      await Promise.all(
        languages.map(lang => this.loadLocaleData(lang))
      );
      isInitialized = true;
    } catch (error) {
      console.error('Failed to preload locales:', error);
    }
  }

  // 检查是否已加载
  isLoaded(): boolean {
    return !!localeCache[this.currentLanguage];
  }

  // 重新加载当前语言包
  async reloadCurrentLocale(): Promise<void> {
    await this.loadLocaleData(this.currentLanguage);
  }

  // 清除缓存并重新加载
  async clearCacheAndReload(): Promise<void> {
    Object.keys(localeCache).forEach(key => {
      delete localeCache[key as Language];
    });
    isInitialized = false;
    await this.loadLocaleData(this.currentLanguage);
  }
}

export const languageService = new LanguageService();
export default languageService; 