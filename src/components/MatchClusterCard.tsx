import { MatchCluster } from '@/types'
import { Users, Star, MapPin, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

interface MatchClusterCardProps {
  cluster: MatchCluster
  activityId: string
  className?: string
}

export default function MatchClusterCard({ cluster, activityId, className = '' }: MatchClusterCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50'
    if (score >= 80) return 'text-blue-600 bg-blue-50'
    if (score >= 70) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getScoreText = (score: number) => {
    if (score >= 90) return '极高匹配'
    if (score >= 80) return '高度匹配'
    if (score >= 70) return '中等匹配'
    return '一般匹配'
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow ${className}`}>
      {/* 聚类头部信息 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cluster.color }}></div>
          <h3 className="font-medium text-gray-900">{cluster.name}</h3>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(cluster.matchScore)}`}>
          <Star className="w-3 h-3 inline mr-1" />
          {cluster.matchScore}% {getScoreText(cluster.matchScore)}
        </div>
      </div>

      {/* 聚类描述 */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{cluster.description}</p>

      {/* 聚类统计 */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {cluster.memberCount} 人
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {cluster.commonLocation || '多地区'}
          </div>
        </div>
      </div>

      {/* 成员预览 */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {cluster.members.slice(0, 4).map((member, index) => (
            <Link
              key={member.id}
              to={`/p/${member.slug}`}
              className="relative"
            >
              <div 
                className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-2 border-white hover:scale-110 transition-transform flex items-center justify-center text-white text-xs font-bold"
                title={member.name}
              >
                {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </Link>
          ))}
          {cluster.memberCount > 4 && (
            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-600">
              +{cluster.memberCount - 4}
            </div>
          )}
        </div>

        <Link
          to={`/activities/${activityId}/match?cluster=${cluster.id}`}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          查看详情 →
        </Link>
      </div>

      {/* 共同兴趣标签 */}
      {cluster.commonInterests && cluster.commonInterests.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-1">
            {cluster.commonInterests.slice(0, 3).map((interest, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {interest}
              </span>
            ))}
            {cluster.commonInterests.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{cluster.commonInterests.length - 3}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}