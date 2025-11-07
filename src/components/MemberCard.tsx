import { User } from '@/types'
import { MapPin, Briefcase, GraduationCap, Star, MessageCircle, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'

interface MemberCardProps {
  user: User
  matchScore?: number
  showActions?: boolean
  className?: string
  eventId?: string
  fromCluster?: boolean
}

export default function MemberCard({ user, matchScore, showActions = true, className = '', eventId, fromCluster = false }: MemberCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50'
    if (score >= 80) return 'text-blue-600 bg-blue-50'
    if (score >= 70) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (navigator.share) {
      navigator.share({
        title: `${user.name}的名片`,
        text: user.bio || `查看${user.name}的个人名片`,
        url: `${window.location.origin}/p/${user.slug}`
      })
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(`${window.location.origin}/p/${user.slug}`)
      // 这里可以添加一个toast提示
    }
  }

  // 构建链接URL，如果来自聚类页面则添加参数
  const linkUrl = fromCluster && eventId 
    ? `/p/${user.slug}?eventId=${eventId}&otherUserId=${user.id}&from=cluster`
    : `/p/${user.slug}`;

  return (
    <Link 
      to={linkUrl}
      className={`block bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all hover:border-blue-200 ${className}`}
    >
      {/* 头部信息 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-medium text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.title}</p>
          </div>
        </div>
        
        {matchScore && (
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(matchScore)}`}>
            <Star className="w-3 h-3 inline mr-1" />
            {matchScore}%
          </div>
        )}
      </div>

      {/* 基本信息 */}
      <div className="space-y-2 mb-3">
        {user.company && (
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{user.company}</span>
          </div>
        )}
        
        {user.education && (
          <div className="flex items-center text-sm text-gray-600">
            <GraduationCap className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{user.education}</span>
          </div>
        )}
        
        {user.location && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{user.location}</span>
          </div>
        )}
      </div>

      {/* 个人简介 */}
      {user.bio && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{user.bio}</p>
      )}

      {/* 技能标签 */}
      {user.skills && user.skills.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {user.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
            {user.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{user.skills.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 兴趣爱好 */}
      {user.interests && user.interests.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {user.interests.slice(0, 3).map((interest, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full"
              >
                {interest}
              </span>
            ))}
            {user.interests.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{user.interests.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      {showActions && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                // 这里可以添加发消息功能
              }}
              className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              发消息
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Share2 className="w-4 h-4 mr-1" />
              分享
            </button>
          </div>
          
          <span className="text-xs text-gray-400">
            查看详情 →
          </span>
        </div>
      )}
    </Link>
  )
}