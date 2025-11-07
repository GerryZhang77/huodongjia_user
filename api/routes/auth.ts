/**
 * This is a user authentication API route demo.
 * Handle user registration, login, token management, etc.
 */
import { Router, type Request, type Response } from 'express'

const router = Router()

/**
 * User Login
 * POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement register logic
})

/**
 * User Login
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    // 验证请求参数
    if (!identifier || !password) {
      res.status(400).json({
        success: false,
        message: '请输入账号和密码'
      });
      return;
    }

    // 测试用户账号验证
    const validCredentials = [
      { identifier: 'user1', password: '123456' },
      { identifier: 'testuser', password: '123456' },
      { identifier: '13800138000', password: '123456' }
    ];

    const isValidUser = validCredentials.some(
      cred => cred.identifier === identifier && cred.password === password
    );

    if (!isValidUser) {
      res.status(401).json({
        success: false,
        message: '账号或密码错误'
      });
      return;
    }

    // 生成测试token
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItaWQiLCJpYXQiOjE2MzQ1Njc4OTB9.test-signature';

    // 返回成功响应
    res.json({
      success: true,
      message: '登录成功',
      token,
      user: {
        id: 'test-user-id',
        phone: '13800138000',
        name: '测试用户',
        user_type: 'participant',
        age: 25,
        occupation: '产品经理',
        company: '互联网科技公司',
        tags: ['创新', '产品', '技术'],
        wechat_qr: 'https://example.com/qr/test.jpg'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
})

/**
 * Get Current User Info
 * GET /api/auth/me
 */
router.get('/me', async (req: Request, res: Response): Promise<void> => {
  try {
    // 检查Authorization header
    const authHeader = req.headers.authorization;
    
    // 为了演示目的，如果没有认证头，我们提供一个默认用户
    // 在生产环境中，这里应该严格验证认证token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // 返回默认演示用户
      const defaultUser = {
        id: 'demo-user-001',
        account: 'demo_user',
        name: '演示用户',
        age: 28,
        phone: '13800138000',
        email: 'demo@example.com',
        occupation: '产品经理',
        company: '科技创新公司',
        user_type: 'user',
        biograph: '年级: 研究生\n职能部门: 产品部\n行业: 互联网科技\n优势: 具有丰富的产品设计经验，擅长用户体验优化和数据分析\n一件最自豪的事情: 主导设计的产品获得了年度最佳用户体验奖',
        tags: '["产品设计", "用户体验", "数据分析"]',
        wechat_qr: null
      };

      res.json({
        success: true,
        user: defaultUser
      });
      return;
    }

    // 这里应该验证token并获取用户信息
    // 为了演示，我们返回模拟数据
    const mockUser = {
      id: "6b0304e5-1236-465e-9ebf-78d6bd511a45",
      account: "mhrliqyg",
      name: "李芸萱",
      age: null,
      phone: null,
      email: "",
      occupation: "地空地质学（材料及环境矿物）",
      company: "",
      user_type: "user",
      biograph: "年级: 25博\n职能部门: 综合事务部\n行业: 绿色科技与碳中和\n优势: 创建石界环游项目 获得中国国际创新大赛北京市一等奖 并晋级国赛\n一件最自豪的事情: 参与创新创业比赛并取得较好成绩，大一自主举办初中暑期班创业",
      tags: "[]",
      wechat_qr: null
    };

    res.json({
      success: true,
      user: mockUser
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
})

/**
 * User Logout
 * POST /api/auth/logout
 */
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement logout logic
})

export default router
