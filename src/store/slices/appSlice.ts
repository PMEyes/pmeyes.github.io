import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
  theme: 'light' | 'dark';
  language: 'zh-CN' | 'en-US';
  isLoading: boolean;
  error: string | null;
  sidebarOpen: boolean;
}

const initialState: AppState = {
  theme: 'light',
  language: 'zh-CN',
  isLoading: false,
  error: null,
  sidebarOpen: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<'zh-CN' | 'en-US'>) => {
      state.language = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const {
  setTheme,
  setLanguage,
  setLoading,
  setError,
  clearError,
  toggleSidebar,
  setSidebarOpen,
} = appSlice.actions;

export default appSlice.reducer; 