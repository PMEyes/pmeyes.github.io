import { Language } from '@/types';
import { languageService } from './languageService';
import { store } from '@/store';
import { setLanguage } from '@/store/slices/appSlice';

export interface LocaleRegistrationConfig {
  defaultLanguage: Language;
  supportedLanguages: Language[];
  autoLoad: boolean;
  preloadAll: boolean;
}

class LocaleRegistrationService {
  private config: LocaleRegistrationConfig;
  private isRegistered = false;

  constructor(config: LocaleRegistrationConfig = {
    defaultLanguage: 'zh-CN',
    supportedLanguages: ['zh-CN', 'en-US'],
    autoLoad: true,
    preloadAll: false,
  }) {
    this.config = config;
  }

  /**
   * 注册语言包服务
   * 在页面加载时调用此方法
   */
  async register(): Promise<void> {
    if (this.isRegistered) {
      console.warn('Locale registration service is already registered');
      return;
    }

    try {
      console.log('Registering locale service...');

      // 1. 初始化语言服务
      await languageService.initializeCurrentLanguage();

      // 2. 更新 Redux store 中的语言状态
      const currentLanguage = languageService.getCurrentLanguage();
      store.dispatch(setLanguage(currentLanguage));

      // 3. 如果需要预加载所有语言包
      if (this.config.preloadAll) {
        await this.preloadAllLocales();
      }

      this.isRegistered = true;
      console.log('Locale service registered successfully');
    } catch (error) {
      console.error('Failed to register locale service:', error);
      throw error;
    }
  }

  /**
   * 预加载所有支持的语言包
   */
  private async preloadAllLocales(): Promise<void> {
    try {
      console.log('Preloading all locales...');
      await languageService.preloadAllLocales();
      console.log('All locales preloaded successfully');
    } catch (error) {
      console.error('Failed to preload locales:', error);
    }
  }

  /**
   * 切换语言并重新注册服务包
   */
  async switchLanguage(language: Language): Promise<void> {
    try {
      console.log(`Switching language to: ${language}`);

      // 1. 检查是否已经加载了目标语言
      if (!languageService.isLoaded() || languageService.getCurrentLanguage() !== language) {
        // 2. 设置新语言
        await languageService.setLanguage(language);

        // 3. 更新 Redux store
        store.dispatch(setLanguage(language));

        console.log(`Language switched to ${language} successfully`);
      } else {
        console.log(`Language ${language} is already active and loaded`);
        // 只更新 Redux store
        store.dispatch(setLanguage(language));
      }
    } catch (error) {
      console.error(`Failed to switch language to ${language}:`, error);
      throw error;
    }
  }

  /**
   * 重新注册服务包（用于刷新或重新加载）
   */
  async reRegister(): Promise<void> {
    this.isRegistered = false;
    await this.register();
  }

  /**
   * 清除缓存并重新注册
   */
  async clearCacheAndReRegister(): Promise<void> {
    try {
      await languageService.clearCacheAndReload();
      await this.reRegister();
    } catch (error) {
      console.error('Failed to clear cache and re-register:', error);
      throw error;
    }
  }

  /**
   * 检查是否已注册
   */
  isServiceRegistered(): boolean {
    return this.isRegistered;
  }

  /**
   * 获取注册配置
   */
  getConfig(): LocaleRegistrationConfig {
    return { ...this.config };
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<LocaleRegistrationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// 创建默认的注册服务实例
export const localeRegistrationService = new LocaleRegistrationService();

export default localeRegistrationService; 