import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService } from '@/services/api';

// 简化的认证状态类型
interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: any) => void;
  initializeAuth: () => Promise<void>;
}

// Mock登录函数 - 简化版本
const mockLogin = async (phone: string, password: string) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (phone === '13800138000' && password === '123456') {
    return {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 'current-user',
        phone: '13800138000',
        name: '王小华',
        title: '高级产品经理',
        company: '互联网科技有限公司',
        avatar: null
      }
    };
  } else {
    throw new Error('手机号或密码错误');
  }
};

const mockGetUserInfo = async (token: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (token.startsWith('mock-jwt-token-')) {
    return {
      id: 'current-user',
      phone: '13800138000',
      name: '王小华',
      title: '高级产品经理',
      company: '互联网科技有限公司',
      avatar: null
    };
  } else {
    throw new Error('Token无效');
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (identifier: string, password: string) => {
        try {
          const response = await apiService.login(identifier, password);
          
          if (response.success) {
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
            });
          } else {
            throw new Error(response.message || '登录失败');
          }
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        apiService.clearToken();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('auth-storage');
      },

      updateUser: (userData: any) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      initializeAuth: async () => {
        const token = get().token;
        if (token) {
          try {
            const user = await mockGetUserInfo(token);
            set({
              user,
              isAuthenticated: true,
            });
          } catch (error) {
            get().logout();
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;