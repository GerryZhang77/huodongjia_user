import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Star, 
  MapPin, 
  Building2,
  Edit3,
  Loader2
} from 'lucide-react';
import { apiService } from '@/services/api';

// 定义新的数据类型
interface MatchMember {
  id?: string;
  age?: number | null;
  sex?: string;
  tel?: string | null;
  name: string;
  email?: string | null;
  score: number;
  status?: string;
  user_id?: string;
  biograph?: string;
  event_id?: string;
  location?: string | null;
  created_at?: string;
  occupation?: string;
  other_info?: string;
  student_id?: string;
  updated_at?: string;
  enrollmentId: string;
}

interface MatchGroup {
  groupId: number;
  groupName: string;
  members: MatchMember[];
}



interface ProcessedMember {
  id: string;
  name: string;
  occupation: string;
  company: string;
  tags: string[];
  score: number;
  phone: string;
  email: string;
  age: number;
  gender: string;
  city: string;
}

export default function ClusterMembers() {
  const { activityId, clusterId } = useParams<{ activityId: string; clusterId: string }>();
  const navigate = useNavigate();
  
  const [groupData, setGroupData] = useState<MatchGroup | null>(null);
  const [members, setMembers] = useState<ProcessedMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      if (!activityId || !clusterId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // 只获取匹配结果数据，不再依赖 getEventEnrollments
        const matchResponse = await apiService.getMatchResults();
        
        if (!matchResponse.success) {
          setError('加载数据失败');
          return;
        }

        // 根据 clusterId 找到对应的组（这里假设 clusterId 对应 groupId）
        const groupId = parseInt(clusterId);
        const targetGroup = matchResponse.data.groups.find((group: MatchGroup) => group.groupId === groupId);
        
        if (!targetGroup) {
          setError('未找到对应的匹配组');
          return;
        }

        setGroupData(targetGroup);

        // 处理成员数据，直接使用API返回的完整成员信息
        const processedMembers: ProcessedMember[] = targetGroup.members.map((member: MatchMember) => {
          // 解析biograph字段（如果存在）
          let parsedBiograph: any = {};
          if (member.biograph) {
            try {
              parsedBiograph = JSON.parse(member.biograph);
            } catch (e) {
              console.warn('Failed to parse biograph:', member.biograph);
            }
          }
          
          return {
            id: member.user_id || member.id || member.enrollmentId,
            name: member.name,
            occupation: member.occupation || parsedBiograph.职能部门 || '未知职业',
            company: parsedBiograph.行业 || '未知公司',
            tags: parsedBiograph.优势 ? [parsedBiograph.优势] : [],
            score: member.score,
            phone: member.tel || '',
            email: member.email || '',
            age: member.age || 0,
            gender: member.sex || '',
            city: member.location || ''
          };
        });

        setMembers(processedMembers);
        
      } catch (err) {
        setError('网络错误，请重试');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [activityId, clusterId]);

  // 处理成员点击
  const handleMemberClick = (member: ProcessedMember) => {
    navigate(`/activity/${activityId}/user/${member.id}?from=cluster`);
  };

  // 处理编辑个人资料
  const handleEditProfile = () => {
    navigate(`/activity/${activityId}/profile/edit`);
  };

  // 处理返回
  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">加载中...</span>
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
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            重试
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

          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 聚类信息卡片 */}
        {groupData && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <h2 className="text-xl font-bold text-gray-900">
                  {(() => {
                    // 使用正则表达式提取汉字
                    const chineseChars = groupData.groupName.match(/[\u4e00-\u9fa5]+/g);
                    return chineseChars ? chineseChars.join('') : groupData.groupName;
                  })()}
                </h2>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-gray-700">
                    匹配组
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{members.length} 人</span>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              基于{(() => {
                // 使用正则表达式提取汉字
                const chineseChars = groupData.groupName.match(/[\u4e00-\u9fa5]+/g);
                return chineseChars ? chineseChars.join('') : groupData.groupName;
              })()}的智能匹配结果
            </p>
          </div>
        )}

        {/* 成员列表 */}
        {members.length > 0 ? (
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                onClick={() => handleMemberClick(member)}
                className="bg-white rounded-2xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* 头像 */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* 基本信息 */}
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {member.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span>{Math.round(member.score * 100)}%</span>
                      </div>
                    </div>

                    {/* 职业信息 */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Building2 className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">
                        {member.occupation} @ 北京大学
                      </span>
                    </div>

                    {/* 兴趣标签 */}
                    {member.tags.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-2">兴趣标签</p>
                        <div className="flex flex-wrap gap-1">
                          {member.tags.slice(0, 4).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {member.tags.length > 4 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                              +{member.tags.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 空态 */
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无匹配对象</h3>
            <p className="text-gray-600 mb-6">
              完善您的名片信息，获得更精准的匹配推荐
            </p>
            <button
              onClick={handleEditProfile}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              完善名片信息
            </button>
          </div>
        )}
      </div>
    </div>
  );
}