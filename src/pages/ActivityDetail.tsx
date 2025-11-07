import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  User,
  ArrowRight,
  Building,
  DollarSign
} from 'lucide-react';

export default function ActivityDetail() {
  const navigate = useNavigate();

  const handleEnterActivity = () => {
    navigate(`/activities/demo-activity/match`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* 左侧Logo */}
          <div className="flex items-center">
            <img 
              src="/logo.png" 
              alt="北大创新学社" 
              className="h-12 max-w-xs object-contain"
            />
          </div>
          
          {/* 右侧用户按钮 */}
          <button 
            onClick={() => navigate('/cards')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 活动封面 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <img
              src="/ma.png"
              alt="北京大学学生创新学社秋季骨干迎新会"
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="p-6">
            {/* 活动标题 */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">北京大学学生创新学社秋季骨干迎新会</h1>
              <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                进行中
              </div>
            </div>

            {/* 活动基本信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="text-blue-500" style={{width: '20px', height: '20px'}} />
                <div>
                  <p className="font-medium">活动时间</p>
                  <p className="text-sm">2025/10/31（周五）18：00-23：00</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-medium">活动地点</p>
                  <p className="text-sm">北京市海淀区青龙桥街道二河开21号艺术区wespace轰趴营地</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600">
                <Building className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium">主办方</p>
                  <p className="text-sm">北京大学学生创新学社</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">活动费用</p>
                  <p className="text-sm">免费</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600">
                <Users className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium">报名人数</p>
                  <p className="text-sm">220人</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600">
                <Clock className="text-purple-500" style={{width: '20px', height: '20px'}} />
                <div>
                  <p className="font-medium">活动时长</p>
                  <p className="text-sm">5小时</p>
                </div>
              </div>
            </div>

            {/* 活动描述 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">活动详情</h3>
              <div className="prose prose-sm max-w-none text-gray-600">
                <p>青春逢创新,骨干聚初心。北京大学学生创新学社2025年秋季骨干迎新会以"创新"为纽带，连接新老骨干，打造"有温度、有活力、有资源"的社群生态。</p>
              </div>
            </div>

            {/* 活动流程 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">活动流程</h3>
              <div className="prose prose-sm max-w-none text-gray-600">
                <div className="space-y-2">
                  <p>1. 17:30-18:00「暖场签到」签到时可领取定制伴手礼哟</p>
                  <p>2. 18:00-18:10「开场仪式」</p>
                  <p>3. 18:10-18:30「会长致辞，部长团介绍」</p>
                  <p>4. 18:30-19:40「节目与互动，游戏与抽奖」</p>
                  <p>5. 19:40-22:40「自由交流，匹配与链接」</p>
                </div>
              </div>
            </div>

            {/* 小贴士 */}
            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-md font-semibold text-blue-900 mb-2">💡 小贴士</h4>
                <p className="text-blue-800 text-sm leading-relaxed">
                  <strong className="text-purple-700 font-bold">NFC互动匹配：</strong>现场设置"<span className="text-orange-600 font-semibold">匹配互动环节</span>"。我们根据每位骨干的学院、部门、年级、兴趣、创投资源等信息为你匹配了<span className="text-green-600 font-semibold">契合的伙伴</span>。
                  <br /><br />
                  1. 可通过现场二维码查询，快速锁定"<span className="text-pink-600 font-semibold">志同道合</span>"的伙伴；
                  <br />
                  2. 参与者可通过手机贴近对方的<span className="text-indigo-600 font-semibold">NFC手环</span>，实时查看两人匹配度（如"<span className="text-emerald-600 font-semibold">兴趣契合度</span>"，"<span className="text-amber-600 font-semibold">资源互补度</span>"，"都对'<span className="text-red-600 font-bold">人工智能</span>'感兴趣"）。
                  <br /><br />
                  期待你在现场找到<span className="text-pink-600 font-semibold">志同道合</span>的"<span className="text-purple-600 font-bold">创新搭子</span>"，开启属于你的<span className="text-blue-600 font-bold">骨干之旅</span>！
                </p>
              </div>
            </div>

            {/* 茶歇区 */}
            <div className="mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-md font-semibold text-green-900 mb-2">☕ 茶歇区</h4>
                <p className="text-green-800 text-sm leading-relaxed">
                  提供餐食和饮品，大家可自由交流，或约匹配骨干一起探讨未来想做的活动项目、资源对接或其他需求（如"想找技术合伙人"）。
                </p>
              </div>
            </div>

            {/* 活动标签 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">活动标签</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  骨干迎新
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  创新创业
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  互动匹配
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  NFC联动
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  创意交流
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  资源对接
                </span>
              </div>
            </div>

            {/* 进入活动按钮 */}
            <div className="flex justify-center">
              <button
                onClick={handleEnterActivity}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                进入活动
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}