import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  TrendingUp, 
  Eye, 
  MessageCircle,
  Smartphone,
  QrCode,
  Zap,
  Star,
  MapPin,
  Calendar,
  User
} from 'lucide-react';
import { apiService } from '../services/api';
// 移除不再使用的类型导入

// Mock data
const mockActivity = {
  id: 'demo-activity',
  title: '科技创新交流会',
  location: '上海国际会议中心',
  startTime: '2024-02-15T14:00:00Z',
  current_participants: 85,
    max_participants: 120,
};

const mockClusters = [
  {
    id: 'cluster-1',
    name: '技术交流群',
    description: '对技术分享和学习感兴趣的参与者',
    memberCount: 12,
    matchScore: 0.85,
    tags: ['技术', '编程', '学习'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'cluster-2', 
    name: '创业讨论组',
    description: '有创业想法或经验的参与者',
    memberCount: 8,
    matchScore: 0.78,
    tags: ['创业', '商业', '投资'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'cluster-3',
    name: '设计师联盟',
    description: '从事设计相关工作的参与者',
    memberCount: 6,
    matchScore: 0.72,
    tags: ['设计', 'UI/UX', '创意'],
    color: 'from-purple-500 to-pink-500'
  }
];

const mockAnnouncements = [
  {
    id: 1,
    title: '欢迎参加学社骨干迎新会',
    content: '亲爱的骨干伙伴们：\n为确保活动顺利开展，请留意以下事项：\n1. 请主持人、节目组和工作组提前至少15分钟到达现场；\n2. 互动提示：现场设置"骨干匹配环节"，如有疑问可咨询外联部陆言骄部长；NFC手环为学社给大家定制的个人专属周边，请勿遗失，后续学社活动可继续使用；\n3. 注意事项：请保管好个人物品，遵守现场秩序；活动提供茶歇，请适量取用，保持现场整洁；\n4. 联系方式：如有紧急情况，请联系活动负责人：杨蕴涵部长（19950747357）。',
    time: '6:18',
    type: 'welcome'
  }
];

// 处理组名的函数，移除多余的引号和括号
const cleanGroupName = (groupName: string): string => {
  return groupName.replace(/^\[?"?|"?\]?$/g, '').replace(/^"|"$/g, '');
};

// 处理后的聚类数据接口
interface ProcessedCluster {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  matchScore: number;
  color: string;
}

export default function ActivityMatch() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [activity] = useState(mockActivity);
  const [clusters, setClusters] = useState<ProcessedCluster[]>([]);
  const [announcements] = useState(mockAnnouncements);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [showNFCModal, setShowNFCModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 调用新的匹配结果API
        const matchResponse = await apiService.getMatchResults();

        // 处理匹配结果数据
        const { groups, weights, activityId } = matchResponse.data;

        // 处理聚类数据
        const processedClusters: ProcessedCluster[] = groups.map((group: any, index: number) => {
          const cleanName = cleanGroupName(group.groupName);
          
          // 为每个聚类分配颜色
          const colors = [
            'from-blue-500 to-cyan-500',
            'from-green-500 to-emerald-500', 
            'from-purple-500 to-pink-500',
            'from-orange-500 to-red-500'
          ];

          // 使用weights数组中对应的权重
          const matchScore = weights && weights.length > index ? weights[index] : 0.5;

          // 根据分组名称生成描述
          let description = '智能匹配的参与者群组';
          if (cleanName.includes('兴趣')) {
            description = '基于共同兴趣爱好匹配的参与者';
          } else if (cleanName.includes('年级')) {
            description = '基于年级相近匹配的参与者';
          } else if (cleanName.includes('专业')) {
            description = '基于专业相近匹配的参与者';
          }

          return {
            id: group.groupId.toString(),
            name: cleanName,
            description: description,
            memberCount: group.members.length,
            matchScore: matchScore,
            color: colors[index % colors.length]
          };
        });

        setClusters(processedClusters);
      } catch (err) {
        console.error('Failed to load match data:', err);
        
        // 检查是否是404错误
        if (err instanceof Error && err.message.includes('404')) {
          console.log('检测到404错误，使用模拟数据');
          // 使用模拟数据作为后备方案
          setClusters(mockClusters.map(cluster => ({
            id: cluster.id,
            name: cluster.name,
            description: cluster.description,
            memberCount: cluster.memberCount,
            matchScore: cluster.matchScore,
            color: cluster.color
          })));
        } else {
          setError('加载匹配数据失败，请稍后重试');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleClusterClick = (clusterId: string) => {
    setSelectedCluster(clusterId);
    // 这里可以展开显示聚类成员列表
  };

  const handleViewMembers = (clusterId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // 阻止事件冒泡到父元素
    navigate(`/activities/${id}/clusters/${clusterId}/members`);
  };

  const handleNFCMatch = () => {
    // 显示NFC匹配提示框
    setShowNFCModal(true);
  };

  const handleQRMatch = () => {
    // 模拟扫码匹配，跳转到匹配用户名片页
    navigate('/p/demo-user-2');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">进入活动中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-red-600" />
          </div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回</span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/cards')}
              className="flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 活动信息卡片 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-900">北京大学学生创新学社<br />秋季骨干迎新会</h2>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-600">进行中</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>Wespace轰趴营地</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>2025/10/31</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>220</span>
            </div>
          </div>
        </div>

        {/* 活动公告区域 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            活动公告
          </h3>
          <div className="space-y-3">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900">{announcement.title}</h4>
                    <span className="text-xs text-gray-500">{announcement.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 whitespace-pre-line leading-8">{announcement.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NFC/扫码匹配功能 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            快速匹配
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleNFCMatch}
              className="flex items-center gap-4 p-4 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-gray-900">NFC 匹配</h4>
                <p className="text-sm text-gray-600">靠近其他用户设备进行匹配</p>
              </div>
            </button>
          </div>
        </div>

        {/* 匹配聚类区域 */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            智能匹配聚类
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clusters.map((cluster) => (
              <div
                key={cluster.id}
                onClick={() => handleClusterClick(cluster.id)}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                  selectedCluster === cluster.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cluster.color} opacity-5 rounded-xl`}></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{cluster.name}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700">
                        {Math.round(cluster.matchScore * 100)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{cluster.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{cluster.memberCount} 人</span>
                    </div>
                    <button 
                      onClick={(e) => handleViewMembers(cluster.id, e)}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      查看成员
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NFC匹配提示框 */}
      {showNFCModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">NFC 匹配指引</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                使用手机碰一碰旁边同学的手环 → 使用浏览器打开URL以查看与其匹配程度
              </p>
              <button
                onClick={() => setShowNFCModal(false)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}