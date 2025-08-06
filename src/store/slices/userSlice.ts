import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 简化的用户状态，仅用于基本设置
export interface UserState {
  theme: 'light' | 'dark';
  language: 'zh-CN' | 'en-US';
}

const initialState: UserState = {
  theme: 'light',
  language: 'zh-CN',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<'zh-CN' | 'en-US'>) => {
      state.language = action.payload;
    },
  },
});

export const {
  setTheme,
  setLanguage,
} = userSlice.actions;

export default userSlice.reducer; 