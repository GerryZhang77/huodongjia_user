import { Activity } from '@/types'

type EnrollmentStatus = 'pending' | 'approved' | 'rejected';
import { Clock, CheckCircle, XCircle, AlertCircle, Users } from 'lucide-react'

interface ActivityStatusProps {
  activity: Activity
  enrollmentStatus?: EnrollmentStatus
  className?: string
}

export default function ActivityStatus({ activity, enrollmentStatus, className = '' }: ActivityStatusProps) {
  const getStatusInfo = () => {
    const now = new Date()
    const startDate = new Date(activity.start_time)
    const endDate = new Date(activity.end_time || activity.start_time)
    const enrollEndDate = new Date(activity.end_time || activity.start_time)

    // 如果有报名状态，优先显示报名状态
    if (enrollmentStatus) {
      switch (enrollmentStatus) {
        case 'pending':
          return {
            text: '审核中',
            icon: Clock,
            color: 'text-yellow-600 bg-yellow-50 border-yellow-200'
          }
        case 'approved':
          return {
            text: '已通过',
            icon: CheckCircle,
            color: 'text-green-600 bg-green-50 border-green-200'
          }
        case 'rejected':
          return {
            text: '未通过',
            icon: XCircle,
            color: 'text-red-600 bg-red-50 border-red-200'
          }
      }
    }

    // 活动状态判断
    if (now > endDate) {
      return {
        text: '已结束',
        icon: XCircle,
        color: 'text-gray-600 bg-gray-50 border-gray-200'
      }
    }

    if (now >= startDate && now <= endDate) {
      return {
        text: '进行中',
        icon: AlertCircle,
        color: 'text-blue-600 bg-blue-50 border-blue-200'
      }
    }

    if (now > enrollEndDate) {
      return {
        text: '报名已截止',
        icon: XCircle,
        color: 'text-red-600 bg-red-50 border-red-200'
      }
    }

    if (activity.current_participants >= activity.max_participants) {
      return {
        text: '已满员',
        icon: Users,
        color: 'text-orange-600 bg-orange-50 border-orange-200'
      }
    }

    return {
      text: '报名中',
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50 border-green-200'
    }
  }

  const statusInfo = getStatusInfo()
  const Icon = statusInfo.icon

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${statusInfo.color} ${className}`}>
      <Icon className="w-4 h-4 mr-1" />
      {statusInfo.text}
    </div>
  )
}