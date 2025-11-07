import { create } from 'zustand';

// 简化的应用状态管理
interface AppState {
  // 当前活动ID
  currentActivityId: string | null;
  
  // 加载状态
  isLoading: boolean;
  
  // 错误信息
  error: string | null;
  
  // 设置当前活动ID
  setCurrentActivityId: (id: string | null) => void;
  
  // 设置加载状态
  setLoading: (loading: boolean) => void;
  
  // 设置错误信息
  setError: (error: string | null) => void;
  
  // 清除错误
  clearError: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentActivityId: null,
  isLoading: false,
  error: null,
  
  setCurrentActivityId: (id) => set({ currentActivityId: id }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
}));

export default useAppStore;