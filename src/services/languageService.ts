import { Language, LocaleData, LocaleVariables } from '@/types';
import { DEFAULT_LANGUAGE, STORAGE_KEYS } from '@/constants';
import zhCN from '@/locales/zh-CN.json';
import enUS from '@/locales/en-US.json';

const locales: Record<Language, LocaleData> = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

class LanguageService {
  private currentLanguage: Language = DEFAULT_LANGUAGE;

  constructor() {
    this.loadLanguageFromStorage();
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

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  setLanguage(language: Language): void {
    if (!this.isValidLanguage(language)) {
      throw new Error(`Unsupported language: ${language}`);
    }

    this.currentLanguage = language;
    
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    } catch (error) {
      console.warn('Failed to save language to storage:', error);
    }
  }

  /**
   * 获取文本，支持变量替换
   * @param key 语言键
   * @param variables 可选的变量对象
   * @returns 替换变量后的文本
   */
  getText(key: string, variables?: LocaleVariables): string {
    const locale = locales[this.currentLanguage];
    let text = locale[key] || key;
    
    if (variables) {
      text = this.replaceVariables(text, variables);
    }
    
    return text;
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
    return locales[this.currentLanguage];
  }

  getAllLocales(): Record<Language, LocaleData> {
    return locales;
  }
}

export const languageService = new LanguageService();
export default languageService; 