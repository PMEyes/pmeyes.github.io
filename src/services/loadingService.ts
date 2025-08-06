import { store } from '@/store';
import { setLoading } from '@/store/slices/appSlice';

class LoadingService {
  private static instance: LoadingService;
  private loadingCount = 0;

  private constructor() {}

  static getInstance(): LoadingService {
    if (!LoadingService.instance) {
      LoadingService.instance = new LoadingService();
    }
    return LoadingService.instance;
  }

  /**
   * 显示加载状态
   */
  show(): void {
    this.loadingCount++;
    store.dispatch(setLoading(true));
    console.log('Loading shown, count:', this.loadingCount);
  }

  /**
   * 隐藏加载状态
   */
  hide(): void {
    this.loadingCount = Math.max(0, this.loadingCount - 1);
    if (this.loadingCount === 0) {
      store.dispatch(setLoading(false));
      console.log('Loading hidden');
    } else {
      console.log('Loading count decreased, count:', this.loadingCount);
    }
  }

  /**
   * 强制隐藏加载状态（重置计数器）
   */
  forceHide(): void {
    this.loadingCount = 0;
    store.dispatch(setLoading(false));
    console.log('Loading force hidden');
  }

  /**
   * 获取当前加载状态
   */
  isLoading(): boolean {
    return this.loadingCount > 0;
  }

  /**
   * 获取加载计数器
   */
  getLoadingCount(): number {
    return this.loadingCount;
  }
}

export const loadingService = LoadingService.getInstance(); 