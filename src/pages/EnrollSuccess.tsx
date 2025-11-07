import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Bell, Share2, ArrowRight } from 'lucide-react';
import { useActivityStore } from '@/stores/activityStore';

export default function EnrollSuccess() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activities } = useActivityStore();
  
  const activity = activities.find(a => a.id === id);

  useEffect(() => {
    // 页面加载时的动画效果
    const timer = setTimeout(() => {
      const element = document.getElementById('success-animation');
      if (element) {
        element.classList.add('animate-bounce');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">活动不存在</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 成功图标 */}
        <div className="text-center mb-8">
          <div 
            id="success-animation"
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">报名成功！</h1>
          <p className="text-gray-600">您的报名申请已提交，我们将尽快审核</p>
        </div>

        {/* 活动信息卡片 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{activity.title}</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>{new Date(activity.start_time).toLocaleString()}</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-600">
              <Bell className="w-4 h-4 text-orange-500" />
              <span>审核结果将通过短信和应用内通知发送</span>
            </div>
          </div>
        </div>

        {/* 后续步骤 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">接下来...</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900">等待审核</p>
                <p className="text-sm text-gray-600">主办方将在1-3个工作日内审核您的申请</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900">接收通知</p>
                <p className="text-sm text-gray-600">审核结果将通过短信和应用内消息通知您</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium text-gray-900">参与活动</p>
                <p className="text-sm text-gray-600">审核通过后，按时参加活动并享受精彩体验</p>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-3">
          <button
            onClick={() => navigate(`/activities/${id}`)}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>查看活动详情</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => navigate('/notifications')}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Bell className="w-4 h-4" />
            <span>查看通知</span>
          </button>
          
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: activity.title,
                  text: `我刚刚报名了"${activity.title}"活动，一起来参加吧！`,
                  url: window.location.origin + `/activities/${id}`
                });
              } else {
                // 降级处理：复制链接
                navigator.clipboard.writeText(window.location.origin + `/activities/${id}`);
                alert('活动链接已复制到剪贴板');
              }
            }}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>分享活动</span>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full text-gray-600 py-3 px-6 rounded-lg font-medium hover:text-gray-800 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  );
}