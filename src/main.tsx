import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import { store } from './store'
import { queryClient } from './services/queryClient'
import LoadingAnimation from './components/LoadingAnimation/LoadingAnimation'
import './styles/main.scss'

// 全局加载组件
const GlobalLoading = () => {
  const [isLoading, setIsLoading] = React.useState(true); // 默认显示

  React.useEffect(() => {
    // 监听 store 中的加载状态
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      setIsLoading(state.app.isLoading);
    });

    return unsubscribe;
  }, []);

  // 默认文本获取函数
  const getText = (key: string): string => {
    // 直接返回键名，让 LoadingAnimation 组件自己处理默认值
    return key;
  };

  if (!isLoading) return null;

  return (
    <LoadingAnimation 
      getText={getText}
      theme="default"
    />
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
        <GlobalLoading />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
) 