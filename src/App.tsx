import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ActivityDetail from "@/pages/ActivityDetail";
import ActivityMatch from "@/pages/ActivityMatch";
import UserCard from "@/pages/UserCard";
import MyCards from "@/pages/MyCards";
import ClusterMembers from "@/pages/ClusterMembers";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 登录页面 - 作为入口页面 */}
        <Route path="/login" element={<Login />} />
        
        {/* 忘记密码页面 */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* 默认重定向到登录页 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 受保护的路由 */}
        <Route path="/activities/:id" element={
          <ProtectedRoute>
            <ActivityDetail />
          </ProtectedRoute>
        } />
        
        <Route path="/activities/:id/match" element={
          <ProtectedRoute>
            <ActivityMatch />
          </ProtectedRoute>
        } />
        
        <Route path="/activities/:activityId/clusters/:clusterId/members" element={
          <ProtectedRoute>
            <ClusterMembers />
          </ProtectedRoute>
        } />
        
        <Route path="/activity/:activityId/user/:userId" element={
          <ProtectedRoute>
            <UserCard />
          </ProtectedRoute>
        } />
        
        {/* 新的多活动NFC路由格式 - 优先级更高 */}
        <Route path="/e/:eventId/p/:userId" element={
          <ProtectedRoute>
            <UserCard />
          </ProtectedRoute>
        } />
        
        {/* 原有NFC路由格式 - 向后兼容 */}
        <Route path="/p/:slug" element={
          <ProtectedRoute>
            <UserCard />
          </ProtectedRoute>
        } />
        
        <Route path="/cards" element={
          <ProtectedRoute>
            <MyCards />
          </ProtectedRoute>
        } />
        
        {/* 404 页面 */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-gray-600 mb-8">页面未找到</p>
              <button 
                onClick={() => window.history.back()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                返回上一页
              </button>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}
