import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { HttpServiceConfig, ApiResponse } from '../types/api';

export class HttpService {
  private axiosInstance: AxiosInstance;
  private config: HttpServiceConfig;

  constructor(config: HttpServiceConfig = {}) {
    this.config = {
      baseURL: '/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    };

    this.axiosInstance = axios.create(this.config);
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // 请求拦截器
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // 可以在这里添加认证 token
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        // 统一错误处理
        if (error.response) {
          switch (error.response.status) {
            case 401:
              // 未授权，清除 token 并跳转到登录页
              localStorage.removeItem('token');
              window.location.href = '/login';
              break;
            case 403:
              console.error('权限不足');
              break;
            case 404:
              console.error('请求的资源不存在');
              break;
            case 500:
              console.error('服务器内部错误');
              break;
            default:
              console.error('请求失败');
          }
        } else if (error.request) {
          console.error('网络错误，请检查网络连接');
        } else {
          console.error('请求配置错误');
        }
        return Promise.reject(error);
      }
    );
  }

  // GET 请求
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // POST 请求
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // PUT 请求
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // DELETE 请求
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // PATCH 请求
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.patch<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // 文件上传
  async upload<T = any>(url: string, file: File, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await this.axiosInstance.post<ApiResponse<T>>(url, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config?.headers,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // 错误处理
  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    if (error.message) {
      return new Error(error.message);
    }
    return new Error('请求失败');
  }

  // 更新配置
  updateConfig(config: Partial<HttpServiceConfig>): void {
    this.config = { ...this.config, ...config };
    this.axiosInstance.defaults.baseURL = this.config.baseURL;
    this.axiosInstance.defaults.timeout = this.config.timeout;
    if (this.config.headers) {
      this.axiosInstance.defaults.headers.common = {
        ...this.axiosInstance.defaults.headers.common,
        ...this.config.headers,
      };
    }
  }

  // 获取 axios 实例（用于特殊需求）
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// 创建默认的 HTTP 服务实例
export const httpService = new HttpService();

// 导出类型
export type { AxiosRequestConfig, AxiosResponse };
export type { HttpServiceConfig, ApiResponse } from '../types/api'; 