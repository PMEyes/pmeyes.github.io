import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setLanguage } from '@/store/slices/appSlice';
import { localeRegistrationService } from '@/services/localeRegistrationService';
import { languageService } from '@/services/languageService';
import { Language } from '@/types';

export interface UseLocaleRegistrationOptions {
  autoRegister?: boolean;
  onRegistrationComplete?: () => void;
  onRegistrationError?: (error: Error) => void;
  onLanguageSwitch?: (language: Language) => void;
}

export const useLocaleRegistration = (options: UseLocaleRegistrationOptions = {}) => {
  const {
    autoRegister = true,
    onRegistrationComplete,
    onRegistrationError,
    onLanguageSwitch,
  } = options;

  const dispatch = useAppDispatch();
  const { language, isLoading, error } = useAppSelector(state => state.app);
  
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationError, setRegistrationError] = useState<Error | null>(null);

  // 注册语言包服务
  const register = useCallback(async () => {
    // 如果已经注册，跳过
    if (isRegistered) {
      console.log('Already registered, skipping registration');
      return;
    }

    try {
      setRegistrationError(null);
      await localeRegistrationService.register();
      setIsRegistered(true);
      onRegistrationComplete?.();
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Registration failed');
      setRegistrationError(errorObj);
      onRegistrationError?.(errorObj);
    }
  }, [isRegistered, onRegistrationComplete, onRegistrationError]);

  // 切换语言
  const switchLanguage = useCallback(async (newLanguage: Language) => {
    // 如果正在加载或已经是当前语言，则跳过
    if (isLoading || language === newLanguage) {
      console.log(`Skipping language switch to ${newLanguage} - already current or loading`);
      return;
    }

    try {
      await localeRegistrationService.switchLanguage(newLanguage);
      dispatch(setLanguage(newLanguage));
      onLanguageSwitch?.(newLanguage);
    } catch (error) {
      console.error('Failed to switch language:', error);
      const errorObj = error instanceof Error ? error : new Error('Language switch failed');
      setRegistrationError(errorObj);
      onRegistrationError?.(errorObj);
    }
  }, [dispatch, onLanguageSwitch, onRegistrationError, isLoading, language]);

  // 重新注册
  const reRegister = useCallback(async () => {
    try {
      setRegistrationError(null);
      await localeRegistrationService.reRegister();
      setIsRegistered(true);
      onRegistrationComplete?.();
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Re-registration failed');
      setRegistrationError(errorObj);
      onRegistrationError?.(errorObj);
    }
  }, [onRegistrationComplete, onRegistrationError]);

  // 清除缓存并重新注册
  const clearCacheAndReRegister = useCallback(async () => {
    try {
      setRegistrationError(null);
      await localeRegistrationService.clearCacheAndReRegister();
      setIsRegistered(true);
      onRegistrationComplete?.();
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Cache clear and re-registration failed');
      setRegistrationError(errorObj);
      onRegistrationError?.(errorObj);
    }
  }, [onRegistrationComplete, onRegistrationError]);

  // 获取文本
  const getText = useCallback((key: string, variables?: Record<string, string | number>) => {
    return languageService.getText(key, variables);
  }, []);

  // 异步获取文本
  const getTextAsync = useCallback(async (key: string, variables?: Record<string, string | number>) => {
    return await languageService.getTextAsync(key, variables);
  }, []);

  // 获取当前语言
  const getCurrentLanguage = useCallback(() => {
    return languageService.getCurrentLanguage();
  }, []);

  // 检查是否已加载
  const isLoaded = useCallback(() => {
    return languageService.isLoaded();
  }, []);

  // 自动注册（在组件挂载时）
  useEffect(() => {
    if (autoRegister && !isRegistered) {
      register();
    }
  }, [autoRegister, isRegistered]);

  return {
    // 状态
    isRegistered,
    isLoading,
    error: error || registrationError?.message,
    currentLanguage: language,
    
    // 方法
    register,
    switchLanguage,
    reRegister,
    clearCacheAndReRegister,
    getText,
    getTextAsync,
    getCurrentLanguage,
    isLoaded,
    
    // 服务实例
    languageService,
    localeRegistrationService,
  };
};

export default useLocaleRegistration; 