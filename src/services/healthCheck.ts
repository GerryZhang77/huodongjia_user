// 服务器健康检查服务
export interface HealthCheckResult {
  isHealthy: boolean;
  responseTime?: number;
  error?: string;
  timestamp: number;
}

export interface HealthCheckConfig {
  timeout: number; // 超时时间（毫秒）
  retryCount: number; // 重试次数
  retryDelay: number; // 重试延迟（毫秒）
  heartbeatInterval: number; // 心跳检测间隔（毫秒）
  failureThreshold: number; // 连续失败阈值
}

export class HealthCheckService {
  private config: HealthCheckConfig;
  private baseURL: string;
  private consecutiveFailures: number = 0;
  private isServerHealthy: boolean = true;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private listeners: Array<(isHealthy: boolean) => void> = [];

  constructor(baseURL: string, config?: Partial<HealthCheckConfig>) {
    this.baseURL = baseURL;
    this.config = {
      timeout: 5000, // 5秒超时
      retryCount: 2, // 重试2次
      retryDelay: 1000, // 1秒重试延迟
      heartbeatInterval: 30000, // 30秒心跳间隔
      failureThreshold: 3, // 连续失败3次触发故障保护
      ...config
    };
  }

  // 添加健康状态监听器
  addListener(callback: (isHealthy: boolean) => void) {
    this.listeners.push(callback);
  }

  // 移除健康状态监听器
  removeListener(callback: (isHealthy: boolean) => void) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // 通知所有监听器
  private notifyListeners(isHealthy: boolean) {
    this.listeners.forEach(listener => {
      try {
        listener(isHealthy);
      } catch (error) {
        console.error('健康检查监听器执行错误:', error);
      }
    });
  }

  // 执行单次健康检查
  async checkHealth(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      console.log(`🔍 [HealthCheck] 开始健康检查: ${this.baseURL}/api/health`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(`${this.baseURL}/api/health`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      if (response.ok) {
        console.log(`✅ [HealthCheck] 服务器健康 - 响应时间: ${responseTime}ms`);
        this.consecutiveFailures = 0;
        
        if (!this.isServerHealthy) {
          console.log(`🎉 [HealthCheck] 服务器已恢复健康状态`);
          this.isServerHealthy = true;
          this.notifyListeners(true);
        }

        return {
          isHealthy: true,
          responseTime,
          timestamp: Date.now()
        };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      console.error(`❌ [HealthCheck] 健康检查失败 - 耗时: ${responseTime}ms, 错误: ${errorMessage}`);
      
      this.consecutiveFailures++;
      console.warn(`⚠️ [HealthCheck] 连续失败次数: ${this.consecutiveFailures}/${this.config.failureThreshold}`);

      // 检查是否达到故障阈值
      if (this.consecutiveFailures >= this.config.failureThreshold && this.isServerHealthy) {
        console.error(`🚨 [HealthCheck] 服务器故障！连续失败 ${this.consecutiveFailures} 次，触发故障保护`);
        this.isServerHealthy = false;
        this.notifyListeners(false);
      }

      return {
        isHealthy: false,
        responseTime,
        error: errorMessage,
        timestamp: Date.now()
      };
    }
  }

  // 带重试的健康检查
  async checkHealthWithRetry(): Promise<HealthCheckResult> {
    let lastResult: HealthCheckResult;
    
    for (let attempt = 0; attempt <= this.config.retryCount; attempt++) {
      if (attempt > 0) {
        console.log(`🔄 [HealthCheck] 重试第 ${attempt} 次，延迟 ${this.config.retryDelay}ms`);
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
      }

      lastResult = await this.checkHealth();
      
      if (lastResult.isHealthy) {
        return lastResult;
      }
    }

    return lastResult!;
  }

  // 启动心跳检测
  startHeartbeat() {
    if (this.heartbeatTimer) {
      console.warn('⚠️ [HealthCheck] 心跳检测已在运行');
      return;
    }

    console.log(`💓 [HealthCheck] 启动心跳检测，间隔: ${this.config.heartbeatInterval}ms`);
    
    // 立即执行一次检查
    this.checkHealthWithRetry();

    // 设置定期检查
    this.heartbeatTimer = setInterval(() => {
      this.checkHealthWithRetry();
    }, this.config.heartbeatInterval);
  }

  // 停止心跳检测
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      console.log('🛑 [HealthCheck] 停止心跳检测');
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // 获取当前服务器健康状态
  getServerHealth(): boolean {
    return this.isServerHealthy;
  }

  // 重置故障计数器（用于手动恢复）
  resetFailureCount() {
    console.log('🔄 [HealthCheck] 重置故障计数器');
    this.consecutiveFailures = 0;
  }

  // 强制设置服务器状态（用于测试）
  forceSetServerHealth(isHealthy: boolean) {
    console.log(`🔧 [HealthCheck] 强制设置服务器状态: ${isHealthy ? '健康' : '故障'}`);
    this.isServerHealthy = isHealthy;
    this.notifyListeners(isHealthy);
  }

  // 销毁服务
  destroy() {
    this.stopHeartbeat();
    this.listeners = [];
    console.log('🗑️ [HealthCheck] 健康检查服务已销毁');
  }
}

// 创建全局健康检查服务实例
const baseURL = import.meta.env.VITE_API_BASE_URL === '/api' 
  ? window.location.origin 
  : (import.meta.env.VITE_API_BASE_URL || '/api');

export const healthCheckService = new HealthCheckService(baseURL);

// 导出默认实例
export default healthCheckService;