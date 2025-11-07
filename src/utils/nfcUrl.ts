/**
 * NFC URL 生成工具
 * 用于生成不同环境下的NFC匹配URL
 */

export interface NfcUrlOptions {
  eventId?: string;
  userId: string;
  environment?: 'development' | 'production';
  baseUrl?: string;
}

/**
 * 生成NFC匹配URL
 * @param options 配置选项
 * @returns 生成的NFC URL
 */
export function generateNfcUrl(options: NfcUrlOptions): string {
  const { 
    eventId, 
    userId, 
    environment = 'development',
    baseUrl 
  } = options;

  // 确定基础URL
  let finalBaseUrl: string;
  if (baseUrl) {
    finalBaseUrl = baseUrl;
  } else if (environment === 'production') {
    finalBaseUrl = 'http://eventclub.cn';
  } else {
    finalBaseUrl = 'http://localhost:5173';
  }

  // 生成URL路径
  if (eventId && eventId !== "00000000-0000-0000-000000000000") {
    // 新格式：包含具体的活动ID
    return `${finalBaseUrl}/e/${eventId}/p/${userId}`;
  } else {
    // 旧格式：向后兼容，使用默认活动ID
    return `${finalBaseUrl}/p/${userId}`;
  }
}

/**
 * 解析NFC URL，提取eventId和userId
 * @param url NFC URL
 * @returns 解析结果
 */
export function parseNfcUrl(url: string): { eventId?: string; userId?: string; isValid: boolean } {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // 匹配新格式：/e/{eventId}/p/{userId}
    const newFormatMatch = pathname.match(/^\/e\/([^\/]+)\/p\/([^\/]+)$/);
    if (newFormatMatch) {
      return {
        eventId: newFormatMatch[1],
        userId: newFormatMatch[2],
        isValid: true
      };
    }

    // 匹配旧格式：/p/{userId}
    const oldFormatMatch = pathname.match(/^\/p\/([^\/]+)$/);
    if (oldFormatMatch) {
      return {
        eventId: "00000000-0000-0000-000000000000", // 默认活动ID
        userId: oldFormatMatch[1],
        isValid: true
      };
    }

    return { isValid: false };
  } catch (error) {
    return { isValid: false };
  }
}

/**
 * 生成用于嵌入NFC标签的URL列表
 * @param eventId 活动ID
 * @param userIds 用户ID列表
 * @param environment 环境
 * @returns URL列表
 */
export function generateBatchNfcUrls(
  eventId: string, 
  userIds: string[], 
  environment: 'development' | 'production' = 'development'
): Array<{ userId: string; url: string }> {
  return userIds.map(userId => ({
    userId,
    url: generateNfcUrl({ eventId, userId, environment })
  }));
}

/**
 * 验证NFC URL格式是否正确
 * @param url 待验证的URL
 * @returns 是否为有效的NFC URL
 */
export function isValidNfcUrl(url: string): boolean {
  return parseNfcUrl(url).isValid;
}

/**
 * 获取推荐的NFC URL格式说明
 */
export function getNfcUrlFormatGuide(): {
  newFormat: string;
  oldFormat: string;
  description: string;
} {
  return {
    newFormat: '/e/{eventId}/p/{userId}',
    oldFormat: '/p/{userId}',
    description: `
NFC URL 格式说明：

1. 新格式（推荐）：/e/{eventId}/p/{userId}
   - 支持多活动场景
   - eventId: 具体的活动ID
   - userId: 用户ID
   - 示例：/e/activity-123/p/user-456

2. 旧格式（向后兼容）：/p/{userId}
   - 使用默认活动ID
   - userId: 用户ID  
   - 示例：/p/user-456

环境URL：
- 开发环境：http://localhost:5173
- 生产环境：http://eventclub.cn
    `.trim()
  };
}