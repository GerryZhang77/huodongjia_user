import { useState, useEffect } from 'react'
import { MatchAnalysis as MatchAnalysisType } from '@/types'
import { BarChart3, Loader2, AlertCircle, Users, Target, Heart, TrendingUp } from 'lucide-react'
import MatchRadarChart from './RadarChart'
import { apiService } from '@/services/api'

interface MatchAnalysisProps {
  analysis?: MatchAnalysisType  // 现在是可选的
  rules?: string[]  // 可选的动态规则数组，用于NFC匹配
  className?: string
  // 新增的 NFC 匹配相关 props
  eventId?: string
  otherUserId?: string
}

interface NfcMatchData {
  matchScore: number
  commonInterests: string[]
  userProfile: {
    id: string
    name: string
    occupation: string
    company: string
    interests: string[]
    bio: string
  }
  recommendations: string[]
}

export default function MatchAnalysis({ 
  analysis, 
  rules, 
  className = '', 
  eventId, 
  otherUserId 
}: MatchAnalysisProps) {
  const [nfcMatchData, setNfcMatchData] = useState<NfcMatchData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 当有 eventId 和 otherUserId 时，调用 NFC 匹配接口
  useEffect(() => {
    if (eventId && otherUserId) {
      loadNfcMatchData()
    }
  }, [eventId, otherUserId])

  const loadNfcMatchData = async () => {
    if (!eventId || !otherUserId) return

    setLoading(true)
    setError(null)
    
    try {
      const response = await apiService.getNfcMatchData(otherUserId, eventId)
      
      if (response.success && response.data) {
        setNfcMatchData(response.data)
      } else {
        setError('获取匹配数据失败')
      }
    } catch (err) {
      setError('获取匹配数据失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 如果有 NFC 匹配数据，使用 NFC 数据渲染
  if (eventId && otherUserId) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        {/* 标题 */}
        <div className="flex items-center mb-6">
          <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">NFC 匹配分析</h2>
        </div>

        {/* 加载状态 */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
            <span className="text-gray-600">正在分析匹配度...</span>
          </div>
        )}

        {/* 错误状态 */}
        {error && (
          <div className="flex items-center justify-center py-8 text-red-600">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {/* NFC 匹配结果 */}
        {nfcMatchData && !loading && !error && (
          <div className="space-y-6">
            {/* 总体匹配分数 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full text-white text-2xl font-bold mb-2">
                {Math.round(nfcMatchData.matchScore * 100)}%
              </div>
              <p className="text-gray-600">总体匹配度</p>
            </div>

            {/* 用户资料卡片 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Users className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">匹配用户</h3>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{nfcMatchData.userProfile.name}</p>
                <p className="text-sm text-gray-600">{nfcMatchData.userProfile.occupation} · {nfcMatchData.userProfile.company}</p>
                <p className="text-sm text-gray-700">{nfcMatchData.userProfile.bio}</p>
              </div>
            </div>

            {/* 共同兴趣 */}
            {nfcMatchData.commonInterests && nfcMatchData.commonInterests.length > 0 && (
              <div>
                <div className="flex items-center mb-3">
                  <Heart className="w-5 h-5 text-red-500 mr-2" />
                  <h3 className="font-semibold text-gray-900">共同兴趣</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {nfcMatchData.commonInterests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 用户兴趣 */}
            {nfcMatchData.userProfile.interests && nfcMatchData.userProfile.interests.length > 0 && (
              <div>
                <div className="flex items-center mb-3">
                  <Target className="w-5 h-5 text-green-500 mr-2" />
                  <h3 className="font-semibold text-gray-900">对方兴趣</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {nfcMatchData.userProfile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 推荐建议 */}
            {nfcMatchData.recommendations && nfcMatchData.recommendations.length > 0 && (
              <div>
                <div className="flex items-center mb-3">
                  <TrendingUp className="w-5 h-5 text-purple-500 mr-2" />
                  <h3 className="font-semibold text-gray-900">交流建议</h3>
                </div>
                <ul className="space-y-2">
                  {nfcMatchData.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700 text-sm">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // 原有的分析数据渲染逻辑（向后兼容）
  if (!analysis) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center py-8 text-gray-500">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>暂无匹配分析数据</span>
        </div>
      </div>
    )
  }

  // 将维度数据转换为雷达图需要的格式
  const radarData = {
    score1: analysis.dimensions[0]?.score || 0,
    score2: analysis.dimensions[1]?.score || 0,
    score3: analysis.dimensions[2]?.score || 0,
    score4: analysis.dimensions[3]?.score || 0,
    score5: analysis.dimensions[4]?.score || 0,
    score6: analysis.dimensions[5]?.score || 0,
    score7: analysis.dimensions[6]?.score || 0,
    score8: analysis.dimensions[7]?.score || 0,
    score9: analysis.dimensions[8]?.score || 0,
    score10: analysis.dimensions[9]?.score || 0,
  }

  // 如果有rules，提取对应的维度标签
  const dimensionLabels = rules || analysis.dimensions.map(dim => dim.name);

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* 标题 */}
      <div className="flex items-center mb-6">
        <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">匹配分析</h2>
      </div>

      {/* 雷达图 */}
      <MatchRadarChart rules={dimensionLabels} data={radarData} />
    </div>
  )
}