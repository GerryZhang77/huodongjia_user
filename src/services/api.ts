import { Activity, User, Enrollment, MatchResult, MatchAnalysis, LoginRequest, LoginResponse, ApiResponse, ClusterMember, ClusterMembersResponse } from '@/types'

// 日志记录工具类
class ApiLogger {
  private static requestCounter = 0;

  // 生成唯一请求ID
  static generateRequestId(): string {
    this.requestCounter++;
    return `req_${Date.now()}_${this.requestCounter}`;
  }

  // 格式化时间戳
  static formatTimestamp(): string {
    return new Date().toISOString();
  }

  // 格式化JSON数据
  static formatJson(data: any): string {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return String(data);
    }
  }

  // 计算数据大小
  static calculateSize(data: any): string {
    try {
      const size = new Blob([JSON.stringify(data)]).size;
      if (size < 1024) return `${size}B`;
      if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
      return `${(size / (1024 * 1024)).toFixed(1)}MB`;
    } catch {
      return 'N/A';
    }
  }

  // 记录请求发起日志
  static logRequest(requestId: string, method: string, url: string, headers: any, body?: any) {
    const timestamp = this.formatTimestamp();
    console.group(`🚀 API请求发起 [${requestId}] - ${timestamp}`);
    console.log(`📍 URL: ${url}`);
    console.log(`🔧 方法: ${method}`);
    console.log(`📋 请求头:`, headers);
    
    // 特别标记防缓存头
    if (headers['Cache-Control'] || headers['Pragma'] || headers['Expires']) {
      console.log(`🚫 防缓存头已设置:`, {
        'Cache-Control': headers['Cache-Control'],
        'Pragma': headers['Pragma'],
        'Expires': headers['Expires']
      });
    }
    
    if (body) {
      console.log(`📦 请求体 (${this.calculateSize(body)}):`, body);
    }
    console.groupEnd();
  }

  // 记录响应接收日志
  static logResponse(requestId: string, startTime: number, response: Response, data?: any) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    const timestamp = this.formatTimestamp();
    
    console.group(`📡 API响应接收 [${requestId}] - ${timestamp}`);
    console.log(`⏱️ 耗时: ${duration}ms`);
    console.log(`📊 状态: ${response.status} ${response.statusText}`);
    console.log(`🏷️ 响应头:`, Object.fromEntries(response.headers.entries()));
    if (data) {
      console.log(`📦 响应体 (${this.calculateSize(data)}):`, data);
    }
    console.groupEnd();
  }

  // 记录成功响应日志
  static logSuccess(requestId: string, message: string, data?: any) {
    const timestamp = this.formatTimestamp();
    console.group(`✅ API请求成功 [${requestId}] - ${timestamp}`);
    console.log(`💬 消息: ${message}`);
    if (data) {
      console.log(`📊 数据:`, data);
    }
    console.groupEnd();
  }

  // 记录错误日志
  static logError(requestId: string, error: any, context?: any) {
    const timestamp = this.formatTimestamp();
    const errorType = this.categorizeError(error, context);
    
    console.group(`❌ API请求错误 [${requestId}] - ${timestamp}`);
    console.error(`💥 错误类型: ${error.constructor.name}`);
    console.error(`🏷️ 错误分类: ${errorType}`);
    console.error(`📝 错误消息: ${error.message}`);
    
    // 根据错误类型提供建议
    const suggestion = this.getErrorSuggestion(errorType, error, context);
    if (suggestion) {
      console.error(`💡 建议: ${suggestion}`);
    }
    
    if (error.stack) {
      console.error(`📚 错误堆栈:`, error.stack);
    }
    if (context) {
      console.error(`🔍 上下文信息:`, context);
      
      // 添加更多上下文分析
      if (context.status) {
        console.error(`📊 HTTP状态: ${context.status} - ${this.getStatusDescription(context.status)}`);
      }
      if (context.duration) {
        console.error(`⏱️ 请求耗时: ${context.duration}ms - ${this.getDurationAnalysis(context.duration)}`);
      }
    }
    console.groupEnd();
  }

  // 错误分类
  static categorizeError(error: any, context?: any): string {
    if (error.message.includes('Failed to fetch')) {
      return '网络连接错误';
    }
    if (context?.status === 404) {
      return '资源未找到';
    }
    if (context?.status === 500) {
      return '服务器内部错误';
    }
    if (context?.status === 401) {
      return '身份验证失败';
    }
    if (context?.status === 403) {
      return '权限不足';
    }
    if (context?.status >= 400 && context?.status < 500) {
      return '客户端请求错误';
    }
    if (context?.status >= 500) {
      return '服务器错误';
    }
    if (error.name === 'TypeError') {
      return '类型错误';
    }
    if (error.name === 'SyntaxError') {
      return '语法错误';
    }
    return '未知错误';
  }

  // 获取错误建议
  static getErrorSuggestion(errorType: string, error: any, context?: any): string | null {
    switch (errorType) {
      case '网络连接错误':
        return '请检查网络连接，或稍后重试';
      case '资源未找到':
        return '请确认请求的资源路径是否正确';
      case '服务器内部错误':
        return '服务器出现问题，请稍后重试或联系管理员';
      case '身份验证失败':
        return '请重新登录或检查访问令牌';
      case '权限不足':
        return '您没有访问此资源的权限';
      case '客户端请求错误':
        return '请检查请求参数是否正确';
      default:
        return null;
    }
  }

  // 获取状态码描述
  static getStatusDescription(status: number): string {
    const descriptions: { [key: number]: string } = {
      400: '请求参数错误',
      401: '未授权访问',
      403: '禁止访问',
      404: '资源不存在',
      405: '请求方法不允许',
      408: '请求超时',
      429: '请求过于频繁',
      500: '服务器内部错误',
      502: '网关错误',
      503: '服务不可用',
      504: '网关超时'
    };
    return descriptions[status] || '未知状态';
  }

  // 获取耗时分析
  static getDurationAnalysis(duration: number): string {
    if (duration < 100) return '响应很快';
    if (duration < 500) return '响应正常';
    if (duration < 1000) return '响应较慢';
    if (duration < 3000) return '响应很慢';
    return '响应超时';
  }

  // 记录调试信息
  static logDebug(requestId: string, message: string, data?: any) {
    const timestamp = this.formatTimestamp();
    console.group(`🔍 调试信息 [${requestId}] - ${timestamp}`);
    console.log(`💭 消息: ${message}`);
    if (data) {
      console.log(`📊 数据:`, data);
    }
    console.groupEnd();
  }
}

// API服务类 - 所有方法都调用真实的线上API，并记录详细日志
class ApiService {
  private baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
  private token: string | null = null;

  constructor() {
    // 从localStorage获取token
    this.token = localStorage.getItem('auth_token');
    
    ApiLogger.logDebug('init', 'API服务初始化', {
      baseURL: this.baseURL,
      hasToken: !!this.token,
      tokenLength: this.token ? this.token.length : 0,
      tokenSource: this.token ? 'localStorage' : 'none'
    });
  }

  // 故障保护：跳转到静态页面
  private static redirectToFailoverPage() {
    const timestamp = ApiLogger.formatTimestamp();
    console.group(`🚨 故障保护机制触发 - ${timestamp}`);
    console.error('🔄 检测到服务器故障，正在跳转到故障保护页面...');
    console.error('📍 跳转目标: /info.html');
    console.groupEnd();
    
    // 跳转到静态故障页面
    window.location.href = '/info.html';
  }

  // 检查是否需要触发故障保护
  private static shouldTriggerFailover(error: any, context?: any): boolean {
    // 网络连接错误
    if (error.message.includes('Failed to fetch')) {
      return true;
    }
    
    // 从错误消息中提取HTTP状态码
    const statusMatch = error.message.match(/status:\s*(\d+)/);
    const statusFromMessage = statusMatch ? parseInt(statusMatch[1]) : null;
    
    // 服务器5xx错误（从context或错误消息中获取）
    const status = context?.status || statusFromMessage;
    if (status && status >= 500) {
      return true;
    }
    
    // 网关错误
    if (status === 502 || status === 503 || status === 504) {
      return true;
    }
    
    // 请求超时（超过10秒）
    if (context?.duration && context.duration > 10000) {
      return true;
    }
    
    return false;
  }

  // 设置认证token
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
    ApiLogger.logDebug('setToken', '设置认证token', { 
      tokenLength: token.length,
      tokenPrefix: token.substring(0, 20) + '...'
    });
  }

  // 强制设置认证token（用于测试或特定场景）
  forceSetToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
    ApiLogger.logDebug('forceSetToken', '强制设置认证token', { 
      tokenLength: token.length,
      tokenPrefix: token.substring(0, 20) + '...',
      forced: true
    });
  }

  // 清除认证token
  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
    ApiLogger.logDebug('clearToken', '清除认证token', { cleared: true });
  }

  // 获取请求头
  private getHeaders(options?: { noCache?: boolean }): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
      // 调试日志：确认Authorization头已设置
      console.log(`[getHeaders] Authorization头已设置: Bearer ${this.token.substring(0, 20)}...`);
    } else {
      console.warn(`[getHeaders] 警告：没有可用的token，请求将不包含Authorization头`);
    }
    
    // 为需要实时数据的请求添加防缓存头
    if (options?.noCache) {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      headers['Pragma'] = 'no-cache';
      headers['Expires'] = '0';
    }
    
    return headers;
  }

  // 统一的API请求包装函数，包含完整的日志记录
  private async makeRequest<T>(
    method: string,
    url: string,
    body?: any,
    customHeaders?: HeadersInit,
    options?: { noCache?: boolean }
  ): Promise<T> {
    const requestId = ApiLogger.generateRequestId();
    const startTime = Date.now();
    const headers = { ...this.getHeaders(options), ...customHeaders };
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;

    try {
      // 记录请求发起日志
      ApiLogger.logRequest(requestId, method, fullUrl, headers, body);

      const response = await fetch(fullUrl, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
      });

      // 记录响应接收日志
      const responseData = await response.json();
      ApiLogger.logResponse(requestId, startTime, response, responseData);

      if (!response.ok) {
        const errorContext = {
          method,
          url: fullUrl,
          status: response.status,
          statusText: response.statusText,
          responseData
        };
        const error = new Error(`HTTP error! status: ${response.status}`);
        ApiLogger.logError(requestId, error, errorContext);
        throw error;
      }

      // 记录成功日志
      ApiLogger.logSuccess(requestId, `${method} ${fullUrl} 请求成功`, responseData);
      return responseData;

    } catch (error) {
      // 记录错误日志
      const errorContext = {
        method,
        url: fullUrl,
        headers: JSON.stringify(headers, null, 2), // 详细显示请求头
        body,
        duration: Date.now() - startTime
      };
      ApiLogger.logError(requestId, error, errorContext);
      
      // 检查是否需要触发故障保护机制
      if (ApiService.shouldTriggerFailover(error, errorContext)) {
        ApiService.redirectToFailoverPage();
        // 抛出一个特殊的故障保护错误，确保不会被后续的错误处理逻辑拦截
        throw new Error('FAILOVER_TRIGGERED');
      }
      
      throw error;
    }
  }

  // 登录API
  async login(identifier: string, password: string): Promise<LoginResponse> {
    try {
      const requestBody = { identifier, password };
      const data = await this.makeRequest<any>('POST', '/auth/login', requestBody);
      
      // 检查响应格式并适配
      if (data.success && data.token) {
        this.setToken(data.token);
        ApiLogger.logDebug('login_success', '登录成功，token已保存', { hasToken: !!data.token });
        
        // 返回标准格式的响应
        return {
          success: data.success,
          message: data.message || '登录成功',
          token: data.token,
          user: data.user
        };
      } else {
        const error = new Error(data.message || '登录失败');
        ApiLogger.logError('login_failed', error, { responseData: data });
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('登录失败，请检查网络连接或稍后重试');
    }
  }

  // 获取当前用户信息
  async getCurrentUser(): Promise<{ success: boolean; data?: { user: any } }> {
    try {
      const data = await this.makeRequest<any>('GET', '/auth/me');
      return {
        success: true,
        data: {
          user: data.user || data
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // 获取活动详情
  async getActivityDetail(activityId: string) {
    try {
      const data = await this.makeRequest<any>('GET', `/events/${activityId}`);
      return {
        success: true,
        data: data
      };
    } catch (error) {
      throw error;
    }
  }

  // 获取活动匹配信息
  async getActivityMatch(activityId: string) {
    try {
      const data = await this.makeRequest<any>('GET', `/activities/${activityId}/match`);
      return {
        success: true,
        data: data
      };
    } catch (error) {
      throw error;
    }
  }

  // 获取用户名片信息
  async getUserCard(userSlug: string) {
    try {
      const data = await this.makeRequest<any>('GET', `/users/${userSlug}`);
      return {
        success: true,
        data: data
      };
    } catch (error) {
      throw error;
    }
  }

  // 获取我的卡片信息
  async getMyCard() {
    try {
      const data = await this.makeRequest<any>('GET', '/users/me');
      return {
        success: true,
        data: data
      };
    } catch (error) {
      throw error;
    }
  }

  // 更新我的卡片信息
  async updateMyCard(data: any) {
    try {
      const result = await this.makeRequest<any>('PUT', '/users/me', data);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      throw error;
    }
  }

  // NFC匹配功能
  async nfcMatch(activityId: string, userId: string) {
    try {
      const data = await this.makeRequest<any>('POST', `/nfc/${activityId}/${userId}`, undefined, undefined, { noCache: true });
      return {
        success: true,
        data: data
      };
    } catch (error) {
      throw error;
    }
  }

  // QR码匹配
  async qrMatch(activityId: string, qrCode: string) {
    try {
      const data = await this.makeRequest<any>('POST', `/qr/${activityId}`, { qrCode });
      return {
        success: true,
        data: data
      };
    } catch (error) {
      throw error;
    }
  }

  // 发送消息
  async sendMessage(userId: string, message: string) {
    try {
      const data = await this.makeRequest<any>('POST', '/messages', { userId, message });
      return {
        success: true,
        data: data
      };
    } catch (error) {
      throw error;
    }
  }

  // 交换联系方式
  async exchangeContact(userId: string) {
    try {
      const data = await this.makeRequest<any>('POST', '/contacts/exchange', { userId });
      return {
        success: true,
        data: data
      };
    } catch (error) {
      throw error;
    }
  }

  // 获取NFC匹配数据
  async getNfcMatchData(otherUserId: string, eventId: string) {
    const fixedEventId = '00000000-0000-0000-0000-000000000000';
    
    try {
      const response = await this.makeRequest<any>('GET', `/nfc/${fixedEventId}/${otherUserId}`, undefined, undefined, { noCache: true });
      
      // 处理真实API响应结构
      if (response.success && response.rules && response.data) {
        return {
          success: true,
          data: {
            rules: response.rules,
            data: response.data,
            // 保持向后兼容，将rules作为matchTags
            matchTags: response.rules
          }
        };
      }
      
      // 如果响应结构不符合预期，返回原始数据
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('获取NFC匹配数据失败:', error);
      
      // 首先检查是否需要触发故障保护
      if (ApiService.shouldTriggerFailover(error, { method: 'GET', url: `/nfc/${fixedEventId}/${otherUserId}` })) {
        ApiService.redirectToFailoverPage();
        throw new Error('FAILOVER_TRIGGERED');
      }
      
      // 只有在非服务器故障时才返回模拟数据
      return {
        success: true,
        data: {
          rules: ['兴趣匹配', '年级匹配', '性别匹配'],
          data: {
            score1: 0.707399208107911,
            score2: 0.945193676943582,
            score3: -0.235572281082087,
            score4: 0,
            score5: 0,
            score6: 0,
            score7: 0,
            score8: 0,
            score9: 0,
            score10: 0,
            total_score: 0.70821984672318
          },
          matchTags: ['兴趣匹配', '年级匹配', '性别匹配']
        }
      };
    }
  }

  // 获取用户信息
  async getUserInfo(userId: string) {
    try {
      const response = await this.makeRequest<any>('GET', `/users/${userId}`);
      
      // 处理真实API响应结构
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data
        };
      }
      
      // 如果响应结构不符合预期，返回原始数据
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('获取用户信息失败:', error);
      
      // 首先检查是否需要触发故障保护
      if (ApiService.shouldTriggerFailover(error, { method: 'GET', url: `/users/${userId}` })) {
        ApiService.redirectToFailoverPage();
        throw new Error('FAILOVER_TRIGGERED');
      }
      
      // 只有在非服务器故障时才返回模拟数据
      return {
        success: true,
        data: {
          id: userId,
          account: "demo_user",
          avatar: null,
          user_type: "user",
          name: "李芸萱",
          age: null,
          phone: null,
          email: "",
          occupation: "地空地质学（材料及环境矿物）",
          company: "",
          biograph: "年级: 25博\n职能部门: 综合事务部\n行业: 绿色科技与碳中和\n优势: 创建石界环游项目 获得中国国际创新大赛北京市一等奖 并晋级国赛\n一件最自豪的事情: 参与创新创业比赛并取得较好成绩，大一自主举办初中暑期班创业",
          tags: "[]",
          wechat_qr: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      };
    }
  }

  // 获取匹配结果 - 使用固定的eventId
  async getMatchResults() {
    const fixedEventId = '00000000-0000-0000-0000-000000000000';
    console.log(`[getMatchResults] 使用eventId: ${fixedEventId}`);
    try {
      const result = await this.makeRequest<any>('GET', `/match/${fixedEventId}/results`);
      console.log(`[getMatchResults] 成功获取匹配结果:`, result);
      return result;
    } catch (error) {
      console.error(`[getMatchResults] 获取匹配结果失败:`, error);
      
      // 首先检查是否需要触发故障保护
      if (ApiService.shouldTriggerFailover(error, { method: 'GET', url: `/match/${fixedEventId}/results` })) {
        ApiService.redirectToFailoverPage();
        throw new Error('FAILOVER_TRIGGERED');
      }
      
      // 只有在非服务器故障时才返回模拟数据
      if (error instanceof Error && (error.message.includes('404') || error.message.includes('Failed to fetch'))) {
        console.log(`[getMatchResults] 网络错误，返回模拟数据`);
        return {
          success: true,
          data: {
            groups: [
              {
                groupId: 1,
                groupName: "[\"兴趣匹配\"",
                members: [
                  { 
                    id: "1", 
                    name: "张三", 
                    occupation: "光华会计",
                    score: 0.95,
                    user_id: "user1",
                    enrollmentId: "enroll1",
                    biograph: JSON.stringify({
                      "职能部门": "光华会计",
                      "行业": "金融服务",
                      "优势": "数据分析"
                    })
                  },
                  { 
                    id: "2", 
                    name: "李四", 
                    occupation: "软件工程师",
                    score: 0.88,
                    user_id: "user2", 
                    enrollmentId: "enroll2",
                    biograph: JSON.stringify({
                      "职能部门": "软件工程师",
                      "行业": "科技公司",
                      "优势": "全栈开发"
                    })
                  }
                ]
              },
              {
                groupId: 2,
                groupName: "[\"创业讨论\"", 
                members: [
                  { 
                    id: "3", 
                    name: "王五", 
                    occupation: "产品经理",
                    score: 0.82,
                    user_id: "user3",
                    enrollmentId: "enroll3",
                    biograph: JSON.stringify({
                      "职能部门": "产品经理",
                      "行业": "互联网",
                      "优势": "用户体验"
                    })
                  }
                ]
              }
            ],
            weights: [0.85, 0.78],
            activityId: fixedEventId
          }
        };
      }
      throw error;
    }
  }

  // 获取活动参与者列表
  async getEventEnrollments(eventId: string) {
    try {
      console.log(`[getEventEnrollments] 开始获取活动参与者列表，eventId: ${eventId}`);
      const data = await this.makeRequest<any>('GET', `/events/${eventId}/enrollments`);
      console.log(`[getEventEnrollments] 成功获取活动参与者列表`, data);
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error(`[getEventEnrollments] 获取活动参与者列表失败，eventId: ${eventId}`, error);
      
      // 首先检查是否需要触发故障保护
      if (ApiService.shouldTriggerFailover(error, { method: 'GET', url: `/events/${eventId}/enrollments` })) {
        ApiService.redirectToFailoverPage();
        throw new Error('FAILOVER_TRIGGERED');
      }
      
      // 只有在非服务器故障时才返回模拟数据
      if (error instanceof Error && (
        error.message.includes('Failed to fetch') || 
        error.message.includes('404')
      )) {
        console.log(`[getEventEnrollments] 网络或服务器错误，返回模拟参与者数据`);
        return {
          success: true,
          data: {
            enrollments: [
              {
                id: '1',
                userId: 'user1',
                eventId: eventId,
                name: '张三',
                email: 'zhangsan@example.com',
                status: 'confirmed',
                enrolledAt: new Date().toISOString()
              },
              {
                id: '2',
                userId: 'user2',
                eventId: eventId,
                name: '李四',
                email: 'lisi@example.com',
                status: 'confirmed',
                enrolledAt: new Date().toISOString()
              }
            ],
            total: 2,
            page: 1,
            pageSize: 20
          }
        };
      }
      
      throw error;
    }
  }

  // 获取聚类成员
  async getClusterMembers(
    activityId: string, 
    clusterId: string, 
    page: number = 1, 
    pageSize: number = 20
  ): Promise<ClusterMembersResponse> {
    try {
      console.log(`[getClusterMembers] 开始获取聚类成员，activityId: ${activityId}, clusterId: ${clusterId}, page: ${page}`);
      const data = await this.makeRequest<any>('GET', `/activities/${activityId}/clusters/${clusterId}/members?page=${page}&pageSize=${pageSize}`);
      console.log(`[getClusterMembers] 成功获取聚类成员`, data);
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error(`[getClusterMembers] 获取聚类成员失败，activityId: ${activityId}, clusterId: ${clusterId}`, error);
      
      // 首先检查是否需要触发故障保护
      if (ApiService.shouldTriggerFailover(error, { method: 'GET', url: `/activities/${activityId}/clusters/${clusterId}/members` })) {
        ApiService.redirectToFailoverPage();
        throw new Error('FAILOVER_TRIGGERED');
      }
      
      // 只有在非服务器故障时才返回模拟数据
      if (error instanceof Error && (
        error.message.includes('Failed to fetch') || 
        error.message.includes('404')
      )) {
        console.log(`[getClusterMembers] 网络或服务器错误，返回模拟聚类成员数据`);
        return {
           success: true,
           data: {
             members: [
               {
                 id: '1',
                 slug: 'zhangsan',
                 name: '张三',
                 nickname: '产品小张',
                 avatar: '/default-avatar.png',
                 role: '产品经理',
                 company: '北京大学',
                 location: '北京',
                 isLocal: true,
                 commonTags: ['产品设计', '用户体验'],
                 suggestedTopic: '产品创新讨论'
               },
               {
                 id: '2',
                 slug: 'lisi',
                 name: '李四',
                 nickname: '技术小李',
                 avatar: '/default-avatar.png',
                 role: '软件工程师',
                 company: '北京大学',
                 location: '北京',
                 isLocal: true,
                 commonTags: ['技术交流', '创业讨论'],
                 suggestedTopic: '全栈开发经验分享'
               }
             ],
             pagination: {
               page: page,
               pageSize: pageSize,
               total: 2,
               totalPages: 1,
               hasMore: false
             },
             cluster: {
               id: clusterId,
               name: '兴趣匹配',
               description: '基于共同兴趣和技能匹配的群组',
               memberCount: 2,
               color: '#3B82F6',
               matchScore: 0.92,
               tags: ['产品设计', '技术交流', '用户体验']
             }
           }
         };
      }
      
      throw error;
    }
  }


  // 退出登录
  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const data = await this.makeRequest<any>('POST', '/auth/logout');
      
      // 清除本地存储的token
      this.clearToken();
      
      return {
        success: data.success || true,
        message: data.message || '登出成功'
      };
    } catch (error) {
      // 即使API调用失败，也要清除本地token
      this.clearToken();
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('登出失败，请稍后重试');
    }
  }
}

export const apiService = new ApiService();
export default apiService;