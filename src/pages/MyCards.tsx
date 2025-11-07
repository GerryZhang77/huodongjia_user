import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  User,
  Briefcase,
  Award,
  Building,
  TrendingUp,
  Star,
  LogOut
} from 'lucide-react';
import { apiService } from '@/services/api';

// 用户信息解析接口
interface ParsedUserInfo {
  name: string;
  occupation: string;
  grade?: string;
  functionalDepartment?: string;
  industryAndVC?: string;
  personalStrengths?: string;
  proudestAchievement?: string;
}

export default function MyCards() {
  const navigate = useNavigate();
  
  const [user, setUser] = useState<ParsedUserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 从 biograph 字段解析用户信息
  const parseUserInfo = (userData: any): ParsedUserInfo => {
    const biograph = userData.biograph || '';
    
    // 添加调试日志以验证API响应数据结构
    console.log('API响应用户数据:', userData);
    console.log('biograph内容:', biograph);
    
    // 根据具体的格式解析 biograph 字段中的各种信息
    // 格式示例: "年级: 25博\n职能部门: 综合事务部\n行业创业与投资部门: 人工智能（俱乐部）\n优势: 创建石界环游项目...\n一件最自豪的事情: 参与创新创业比赛..."
    const parseField = (text: string, keyword: string): string | undefined => {
      // 精确匹配关键词后的内容，直到遇到换行符
      const regex = new RegExp(`${keyword}\\s*[：:]\\s*([^\\n]+)`, 'i');
      const match = text.match(regex);
      if (match && match[1]) {
        return match[1].trim();
      }
      return undefined;
    };

    // 添加调试日志显示各字段的解析结果
    const parsedOccupation = parseField(biograph, '专业');
    const parsedGrade = parseField(biograph, '年级');
    const parsedFunctionalDepartment = parseField(biograph, '职能部门');
    const parsedIndustryAndVC = parseField(biograph, '行业创业与投资部门');
    const parsedPersonalStrengths = parseField(biograph, '优势');
    const parsedProudestAchievement = parseField(biograph, '一件最自豪的事情');
    
    console.log('字段解析结果:', {
      专业: parsedOccupation,
      年级: parsedGrade,
      职能部门: parsedFunctionalDepartment,
      行业创业与投资部门: parsedIndustryAndVC,
      优势: parsedPersonalStrengths,
      最自豪的事情: parsedProudestAchievement
    });

    return {
      name: userData.name || '未知用户',
      occupation: parsedOccupation || userData.occupation || '未知专业', // 三级fallback：biograph解析 -> occupation字段 -> 未知专业
      grade: parsedGrade,
      functionalDepartment: parsedFunctionalDepartment,
      industryAndVC: parsedIndustryAndVC, // 修复：使用完整的关键词匹配
      personalStrengths: parsedPersonalStrengths,
      proudestAchievement: parsedProudestAchievement
    };
  };

  // 获取用户数据
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.getCurrentUser();
      
      if (response.success && response.data?.user) {
        const parsedInfo = parseUserInfo(response.data.user);
        setUser(parsedInfo);
      } else {
        throw new Error('获取用户信息失败');
      }
    } catch (err) {
      console.error('获取用户信息错误:', err);
      setError('获取用户信息失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理退出登录
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // 调用退出登录API
      await apiService.logout();
      
      // 跳转到登录页面
      navigate('/login');
    } catch (err) {
      console.error('退出登录错误:', err);
      // 即使API调用失败，也要跳转到登录页面（因为token已被清除）
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchUserData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">暂无用户信息</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* 导航栏 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600">返回</span>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">我的名片</h1>
          <div className="w-9 h-9"></div>
        </div>

        {/* 内容区域 */}
        <div className="p-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* 头像和姓名 */}
            <div className="text-center mb-8">
              {/* 用户头像 */}
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
            </div>

            {/* 用户信息展示 */}
            <div className="space-y-6">
              
              {/* 专业信息 */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">专业</h3>
                  <p className="text-gray-600">{user.occupation || '暂无信息'}</p>
                </div>
              </div>

              {/* 年级 */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">年级</h3>
                  <p className="text-gray-600">{user.grade || '暂无信息'}</p>
                </div>
              </div>

              {/* 职能部门 */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">职能部门</h3>
                  <p className="text-gray-600">{user.functionalDepartment || '暂无信息'}</p>
                </div>
              </div>

              {/* 行业与创投部门 */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">行业与创投部门</h3>
                  <p className="text-gray-600">{user.industryAndVC || '暂无信息'}</p>
                </div>
              </div>

              {/* 个人优势 */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">个人优势</h3>
                  <p className="text-gray-600">{user.personalStrengths || '暂无信息'}</p>
                </div>
              </div>

              {/* 最自豪的成就 */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">最自豪的成就</h3>
                  <p className="text-gray-600">{user.proudestAchievement || '暂无信息'}</p>
                </div>
              </div>

            </div>
          </div>

          {/* 退出登录按钮 */}
          <div className="mt-8">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              {isLoggingOut ? '退出中...' : '退出登录'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}