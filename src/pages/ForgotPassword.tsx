import { Link } from 'react-router-dom';
import { MessageCircle, ArrowLeft, Copy } from 'lucide-react';
import { useState } from 'react';

export default function ForgotPassword() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const administrators = [
    { name: '陆言骄', wechat: 'yanjiao_PKU' },
    { name: '张紫阳', wechat: 'SuperSun77gerry' },
    { name: '彭光明', wechat: 'pgm13111969577' },
    { name: '冯予轩', wechat: 'Murrrrphy' }
  ];

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo和标题 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">活</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">忘记密码</h1>
          <p className="text-gray-600">请联系管理员重置您的密码</p>
        </div>

        {/* 主要内容卡片 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* 说明文字 */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">通过微信联系管理员</h2>
            <p className="text-sm text-gray-600">
              请添加以下任一管理员的微信，说明您需要重置密码，管理员会协助您解决问题。
            </p>
          </div>

          {/* 管理员列表 */}
          <div className="space-y-4 mb-6">
            {administrators.map((admin, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{admin.name}</div>
                    <div className="text-sm text-gray-600 font-mono">
                      微信号：{admin.wechat}
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(admin.wechat, admin.wechat)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedId === admin.wechat ? '已复制' : '复制'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 温馨提示 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-blue-900 mb-2">温馨提示</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 添加微信时请说明您的用户名和需要重置密码</li>
              <li>• 管理员会在工作时间内尽快回复您</li>
              <li>• 为了账户安全，请提供必要的身份验证信息</li>
            </ul>
          </div>

          {/* 返回登录按钮 */}
          <Link
            to="/login"
            className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回登录</span>
          </Link>
        </div>
      </div>
    </div>
  );
}