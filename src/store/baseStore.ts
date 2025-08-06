import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 基础状态接口
export interface BaseState {
  loading: boolean;
  error: string | null;
  lastUpdated?: number;
}

// 列表状态接口
export interface ListState<T> extends BaseState {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// 详情状态接口
export interface DetailState<T> extends BaseState {
  data: T | null;
}

// 工具函数
export const createBaseState = (): BaseState => ({
  loading: false,
  error: null,
  lastUpdated: undefined,
});

export const createListState = <T>(): ListState<T> => ({
  ...createBaseState(),
  items: [],
  total: 0,
  page: 1,
  pageSize: 10,
  hasMore: false,
});

export const createDetailState = <T>(): DetailState<T> => ({
  ...createBaseState(),
  data: null,
});

// 创建基础 slice 的工具函数
export const createBaseSlice = <T extends BaseState>(
  name: string,
  initialState: T,
  additionalReducers?: any
) => {
  return createSlice({
    name,
    initialState,
    reducers: {
      setLoading: (state: T, action: PayloadAction<boolean>) => {
        state.loading = action.payload;
      },
      setError: (state: T, action: PayloadAction<string | null>) => {
        state.error = action.payload;
      },
      clearError: (state: T) => {
        state.error = null;
      },
      setLastUpdated: (state: T, action: PayloadAction<number>) => {
        state.lastUpdated = action.payload;
      },
      ...additionalReducers,
    },
  });
};

// 创建列表 slice 的工具函数
export const createListSlice = <T, U extends ListState<T>>(
  name: string,
  initialState: U,
  additionalReducers?: any
) => {
  return createSlice({
    name,
    initialState,
    reducers: {
      setLoading: (state: U, action: PayloadAction<boolean>) => {
        state.loading = action.payload;
      },
      setError: (state: U, action: PayloadAction<string | null>) => {
        state.error = action.payload;
      },
      clearError: (state: U) => {
        state.error = null;
      },
      setLastUpdated: (state: U, action: PayloadAction<number>) => {
        state.lastUpdated = action.payload;
      },
      setItems: (state: U, action: PayloadAction<T[]>) => {
        state.items = action.payload;
      },
      addItem: (state: U, action: PayloadAction<T>) => {
        state.items.push(action.payload);
      },
      updateItem: (state: U, action: PayloadAction<{ id: string | number; item: Partial<T> }>) => {
        const index = state.items.findIndex((item: any) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload.item };
        }
      },
      removeItem: (state: U, action: PayloadAction<string | number>) => {
        state.items = state.items.filter((item: any) => item.id !== action.payload);
      },
      setTotal: (state: U, action: PayloadAction<number>) => {
        state.total = action.payload;
      },
      setPage: (state: U, action: PayloadAction<number>) => {
        state.page = action.payload;
      },
      setPageSize: (state: U, action: PayloadAction<number>) => {
        state.pageSize = action.payload;
      },
      setHasMore: (state: U, action: PayloadAction<boolean>) => {
        state.hasMore = action.payload;
      },
      clearItems: (state: U) => {
        state.items = [];
        state.total = 0;
        state.page = 1;
        state.hasMore = false;
      },
      ...additionalReducers,
    },
  });
};

// 创建详情 slice 的工具函数
export const createDetailSlice = <T, U extends DetailState<T>>(
  name: string,
  initialState: U,
  additionalReducers?: any
) => {
  return createSlice({
    name,
    initialState,
    reducers: {
      setLoading: (state: U, action: PayloadAction<boolean>) => {
        state.loading = action.payload;
      },
      setError: (state: U, action: PayloadAction<string | null>) => {
        state.error = action.payload;
      },
      clearError: (state: U) => {
        state.error = null;
      },
      setLastUpdated: (state: U, action: PayloadAction<number>) => {
        state.lastUpdated = action.payload;
      },
      setData: (state: U, action: PayloadAction<T | null>) => {
        state.data = action.payload;
      },
      updateData: (state: U, action: PayloadAction<Partial<T>>) => {
        if (state.data) {
          state.data = { ...state.data, ...action.payload };
        }
      },
      clearData: (state: U) => {
        state.data = null;
      },
      ...additionalReducers,
    },
  });
}; 