import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft,
  User,
  Briefcase,
  Trophy,
  Building,
  Star,
  Building2
} from 'lucide-react';
import { apiService } from '@/services/api';
import MatchRadarChart from '@/components/RadarChart';

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

// 匹配数据接口 - 更新以支持真实API响应
interface MatchData {
  matchTags?: string[];  // 保持向后兼容
  rules?: string[];      // 新增：雷达图顶点标签
  data?: {               // 新增：匹配分数数据
    score1: number;
    score2: number;
    score3: number;
    score4: number;
    score5: number;
    score6: number;
    score7: number;
    score8: number;
    score9: number;
    score10: number;
    total_score: number;
  };
}

export default function UserCard() {
  const { slug, activityId, userId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [user, setUser] = useState<ParsedUserInfo | null>(null);
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 添加调试日志
  console.log('路由参数:', { slug, activityId, userId });
  console.log('搜索参数:', Object.fromEntries(searchParams.entries()));
  
  // 检查是否为 NFC 访问
  const isNfcAccess = slug && activityId && userId;
  
  // 检查是否从兴趣分组访问
  const fromParam = searchParams.get('from');
  const isClusterAccess = fromParam === 'cluster' && activityId && userId;

  // 从 biograph 字段解析用户信息
  const parseUserInfo = (userData: any): ParsedUserInfo => {
    const biograph = userData.biograph || '';
    
    // 根据具体的格式解析 biograph 字段中的各种信息
    const parseField = (text: string, keyword: string): string | undefined => {
      // 精确匹配关键词后的内容，直到遇到换行符
      const regex = new RegExp(`${keyword}\\s*[：:]\\s*([^\\n]+)`, 'i');
      const match = text.match(regex);
      if (match && match[1]) {
        return match[1].trim();
      }
      return undefined;
    };

    const parsedOccupation = parseField(biograph, '专业');
    const parsedGrade = parseField(biograph, '年级');
    const parsedFunctionalDepartment = parseField(biograph, '职能部门');
    // 修改：优先匹配"行业:"，如果没有再匹配"行业创业与投资部门:"
    const parsedIndustryAndVC = parseField(biograph, '行业') || parseField(biograph, '行业创业与投资部门');
    const parsedPersonalStrengths = parseField(biograph, '优势');
    const parsedProudestAchievement = parseField(biograph, '一件最自豪的事情');

    return {
      name: userData.name || '未知用户',
      // 修改：优先使用userData.occupation，如果为空再从biograph解析，最后才是默认值
      occupation: userData.occupation || parsedOccupation || '未知专业',
      grade: parsedGrade,
      functionalDepartment: parsedFunctionalDepartment,
      industryAndVC: parsedIndustryAndVC,
      personalStrengths: parsedPersonalStrengths,
      proudestAchievement: parsedProudestAchievement
    };
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 🔍 调试日志：输出 isNfcAccess 的值
        console.log('🔍 [DEBUG] isNfcAccess:', isNfcAccess);
        console.log('🔍 [DEBUG] URL参数 - slug:', slug, 'activityId:', activityId, 'userId:', userId);
        
        // 确定要获取的用户ID - 修复逻辑
        let targetUserId: string;
        
        if (isNfcAccess) {
          // NFC 访问：使用 slug 作为 userId
          targetUserId = slug!;
        } else if (userId) {
          // 其他路由：使用 userId 参数
          targetUserId = userId;
        } else if (slug) {
          // /p/:slug 路由：使用 slug 作为 userId
          targetUserId = slug;
        } else {
          console.error('无法获取用户ID参数');
          setError('无效的用户ID参数');
          setIsLoading(false);
          return;
        }
        
        console.log('最终使用的 targetUserId:', targetUserId);
        
        // 参数验证
        if (!targetUserId || targetUserId === 'undefined') {
          console.error('用户ID参数无效:', targetUserId);
          setError('用户ID参数无效');
          setIsLoading(false);
          return;
        }
        
        const fixedEventId = '00000000-0000-0000-0000-000000000000';

        // 并行获取用户信息和NFC匹配数据
        const [userResponse, nfcResponse] = await Promise.all([
          apiService.getUserInfo(targetUserId),
          apiService.getNfcMatchData(targetUserId, fixedEventId)
        ]);

        // 🔍 调试日志：输出 nfcResponse 的完整内容
        console.log('🔍 [DEBUG] nfcResponse 完整内容:', JSON.stringify(nfcResponse, null, 2));

        if (userResponse.success && userResponse.data) {
          const parsedInfo = parseUserInfo(userResponse.data);
          setUser(parsedInfo);
        }

        if (nfcResponse.success && nfcResponse.data) {
          console.log('🔍 [DEBUG] 设置 matchData 前的数据:', JSON.stringify(nfcResponse.data, null, 2));
          setMatchData(nfcResponse.data);
        } else {
          console.log('🔍 [DEBUG] nfcResponse 不成功或没有数据:', nfcResponse);
        }

      } catch (error) {
        setError('加载用户信息失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [slug, activityId, userId, isNfcAccess, isClusterAccess]);

  // 🔍 调试日志：监听 matchData 变化
  useEffect(() => {
    console.log('🔍 [DEBUG] matchData 状态变化:', JSON.stringify(matchData, null, 2));
    console.log('🔍 [DEBUG] matchData 存在:', !!matchData);
    if (matchData) {
      console.log('🔍 [DEBUG] matchData.rules 存在:', !!matchData.rules);
      console.log('🔍 [DEBUG] matchData.data 存在:', !!matchData.data);
      if (matchData.rules) {
        console.log('🔍 [DEBUG] matchData.rules 内容:', matchData.rules);
      }
      if (matchData.data) {
        console.log('🔍 [DEBUG] matchData.data 内容:', matchData.data);
      }
    }
  }, [matchData]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">加载中...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">加载失败</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">用户不存在</h3>
          <p className="text-gray-600 mb-4">该用户可能已被删除或不存在</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回</span>
            </button>
            
            {!isClusterAccess && (
              <div className="flex items-center gap-2 text-green-600">
                <Star className="w-5 h-5" />
                <span className="text-sm font-medium">NFC 匹配</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 上半部分：匹配分析和雷达图 */}
        {matchData && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* 雷达图显示 - 当有rules和data时显示 */}
            {matchData.rules && matchData.data ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">匹配度分析</h3>
                <MatchRadarChart 
                  rules={matchData.rules} 
                  data={matchData.data} 
                />
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-sm font-semibold text-red-800 mb-2">⚠️ 雷达图未显示原因</h4>
                <div className="text-sm text-red-700">
                  您或对方的部分信息缺失，具体匹配分析暂无法查看
                </div>
              </div>
            )}
          </div>
        )}

        {/* 下半部分：用户信息 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            {/* 用户头像和基本信息 */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h1>
              
              {user.occupation && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  <span>{user.occupation}</span>
                </div>
              )}
            </div>

            {/* 详细信息 */}
            <div className="space-y-6">
              {/* 年级 */}
              {user.grade && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">年级</h3>
                    <p className="text-gray-700">{user.grade}</p>
                  </div>
                </div>
              )}

              {/* 职能部门 */}
              {user.functionalDepartment && (
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">职能部门</h3>
                    <p className="text-gray-700">{user.functionalDepartment}</p>
                  </div>
                </div>
              )}

              {/* 行业与创投部门 */}
              {user.industryAndVC && (
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">行业与创投部门</h3>
                    <p className="text-gray-700">{user.industryAndVC}</p>
                  </div>
                </div>
              )}

              {/* 个人优势 */}
              {user.personalStrengths && (
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">个人优势</h3>
                    <p className="text-gray-700">{user.personalStrengths}</p>
                  </div>
                </div>
              )}

              {/* 最自豪的成就 */}
              {user.proudestAchievement && (
                <div className="flex items-start gap-3">
                  <Trophy className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">最自豪的成就</h3>
                    <p className="text-gray-700">{user.proudestAchievement}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}