import { ReactNode } from 'react'
import { Search, Users, Calendar, AlertCircle } from 'lucide-react'

interface EmptyStateProps {
  type?: 'search' | 'activities' | 'matches' | 'general'
  title?: string
  description?: string
  action?: ReactNode
  className?: string
}

export default function EmptyState({ 
  type = 'general', 
  title, 
  description, 
  action, 
  className = '' 
}: EmptyStateProps) {
  const getDefaultContent = () => {
    switch (type) {
      case 'search':
        return {
          icon: Search,
          title: '没有找到相关活动',
          description: '尝试调整搜索条件或浏览其他分类'
        }
      case 'activities':
        return {
          icon: Calendar,
          title: '暂无活动',
          description: '目前没有符合条件的活动，请稍后再来看看'
        }
      case 'matches':
        return {
          icon: Users,
          title: '暂无匹配结果',
          description: '系统正在为您寻找合适的匹配对象，请稍后查看'
        }
      default:
        return {
          icon: AlertCircle,
          title: '暂无内容',
          description: '这里还没有任何内容'
        }
    }
  }

  const defaultContent = getDefaultContent()
  const Icon = defaultContent.icon
  const displayTitle = title || defaultContent.title
  const displayDescription = description || defaultContent.description

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {displayTitle}
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-sm">
        {displayDescription}
      </p>
      
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  )
}