import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  TrendingUp,
  Star,
  ArrowRight
} from 'lucide-react';
import { useActivityStore } from '@/stores/activityStore';
import { useAuthStore } from '@/stores/authStore';
import type { Activity } from '@/types';

export default function Home() {
  const navigate = useNavigate();
  const { activities } = useActivityStore();
  const { isAuthenticated, user } = useAuthStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);

  const categories = [
    { id: 'all', name: '全部', count: activities.length },
    { id: 'tech', name: '技术', count: activities.filter(a => a.tags?.includes('技术')).length },
    { id: 'business', name: '商业', count: activities.filter(a => a.tags?.includes('商业')).length },
    { id: 'design', name: '设计', count: activities.filter(a => a.tags?.includes('设计')).length },
    { id: 'networking', name: '社交', count: activities.filter(a => a.tags?.includes('社交')).length }
  ];

  useEffect(() => {
    let filtered = activities;

    // 分类筛选
    if (selectedCategory !== 'all') {
      const categoryMap: { [key: string]: string } = {
        'tech': '技术',
        'business': '商业', 
        'design': '设计',
        'networking': '社交'
      };
      filtered = filtered.filter(activity => 
        activity.tags?.includes(categoryMap[selectedCategory])
      );
    }

    // 搜索筛选
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredActivities(filtered);
  }, [activities, selectedCategory, searchTerm]);

  const handleActivityClick = (activityId: string) => {
    navigate(`/activities/${activityId}`);
  };

  const getActivityStatus = (activity: Activity) => {
    const now = new Date();
    const startTime = new Date(activity.start_time);
    const registrationDeadline = new Date(activity.end_time || activity.start_time);

    if (now > startTime) {
      return { text: '已结束', color: 'bg-gray-100 text-gray-600' };
    } else if (now > registrationDeadline) {
      return { text: '报名截止', color: 'bg-red-100 text-red-600' };
    } else if (activity.current_participants >= activity.max_participants) {
      return { text: '名额已满', color: 'bg-yellow-100 text-yellow-600' };
    } else {
      return { text: '报名中', color: 'bg-green-100 text-green-600' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">活动家</h1>
              <p className="text-gray-600">发现精彩活动，结识志同道合的朋友</p>
            </div>
            
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="text-gray-600">欢迎，{user?.name}</span>
                  <button
                    onClick={() => navigate('/cards')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    我的名片
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  登录
                </button>
              )}
            </div>
          </div>

          {/* 搜索栏 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="搜索活动、地点或标签..."
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" />
              <span>筛选</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 分类标签 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">活动总数</p>
                <p className="text-xl font-bold text-gray-900">{activities.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">参与人数</p>
                <p className="text-xl font-bold text-gray-900">
                  {activities.reduce((sum, a) => sum + a.current_participants, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">热门活动</p>
                <p className="text-xl font-bold text-gray-900">
                  {activities.filter(a => a.current_participants > a.max_participants * 0.8).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">推荐活动</p>
                <p className="text-xl font-bold text-gray-900">
                  {activities.filter(a => a.tags?.includes('推荐')).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 活动列表 */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {selectedCategory === 'all' ? '全部活动' : categories.find(c => c.id === selectedCategory)?.name + '活动'}
              ({filteredActivities.length})
            </h2>
          </div>

          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">没有找到相关活动</p>
              <p className="text-sm text-gray-500">尝试调整搜索条件或分类筛选</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((activity) => {
                const status = getActivityStatus(activity);
                return (
                  <div
                    key={activity.id}
                    onClick={() => handleActivityClick(activity.id)}
                    className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    {/* 活动封面 */}
                    <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 relative">
                      <img
                        src={activity.cover_image || `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(`${activity.title} event modern design`)}&image_size=landscape_16_9`}
                        alt={activity.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                          {status.text}
                        </span>
                      </div>
                    </div>

                    {/* 活动信息 */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{activity.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{activity.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(activity.start_time).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{activity.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Users className="w-4 h-4" />
                          <span>{activity.current_participants}/{activity.max_participants}人</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>报名截止：{new Date(activity.end_time).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* 标签 */}
                      {activity.tags && activity.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {activity.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {activity.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{activity.tags.length - 3}</span>
                          )}
                        </div>
                      )}

                      {/* 查看详情按钮 */}
                      <button className="w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                        <span>查看详情</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}