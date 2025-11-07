import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface RadarChartProps {
  rules?: string[];  // 可选的动态维度标签数组
  data: {
    score1: number;
    score2: number;
    score3: number;
    score4: number;
    score5: number;
    score6: number;
    score7: number;
    score8: number;
    score9: number;
    score10: number;
  };
}

// 默认的维度标签（向后兼容）
const defaultDimensionLabels = [
  '专业技能',
  '沟通能力', 
  '团队协作',
  '创新思维',
  '学习能力',
  '解决问题',
  '领导力',
  '执行力',
  '适应性',
  '责任心'
];

export default function MatchRadarChart({ rules, data }: RadarChartProps) {
  // 动态确定使用的维度标签和数量
  const dimensionLabels = rules && rules.length > 0 ? rules : defaultDimensionLabels;
  const dimensionCount = rules && rules.length > 0 ? Math.min(rules.length, 10) : 10;
  
  // 转换数据格式为recharts需要的格式
  const chartData = dimensionLabels.slice(0, dimensionCount).map((label, index) => {
    const scoreKey = `score${index + 1}` as keyof typeof data;
    const rawScore = data[scoreKey] || 0; // 如果score不存在，默认为0
    
    // 将分数转换为0-100的范围，处理负数
    // 假设原始分数范围是-1到1，转换为0-100
    const normalizedScore = Math.max(0, Math.min(100, (rawScore + 1) * 50));
    
    return {
      dimension: label,
      score: normalizedScore,
      rawScore: rawScore, // 保留原始分数用于显示
      fullMark: 100
    };
  });

  // 计算动态的domain范围以适应可能的负数
  const allScores = chartData.map(item => item.score);
  const minScore = Math.min(...allScores);
  const maxScore = Math.max(...allScores);
  const domainMin = Math.max(0, Math.floor(minScore / 10) * 10);
  const domainMax = Math.min(100, Math.ceil(maxScore / 10) * 10);

  return (
    <div className="w-full space-y-6">
      {/* 雷达图区域 */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid gridType="polygon" />
            <PolarAngleAxis 
              dataKey="dimension" 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              className="text-xs"
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[domainMin, domainMax]} 
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              tickCount={6}
            />
            <Radar
              name="匹配度"
              dataKey="score"
              stroke="#8B5CF6"
              fill="#8B5CF6"
              fillOpacity={0.2}
              strokeWidth={2}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* 横条百分比展示区域 */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 mb-4">详细匹配度</h3>
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            {/* 规则名称 */}
            <div className="w-20 sm:w-24 text-xs sm:text-sm text-gray-600 text-right flex-shrink-0">
              {item.dimension}
            </div>
            
            {/* 进度条容器 */}
            <div className="flex-1 flex items-center space-x-3">
              {/* 进度条 */}
              <div className="flex-1 bg-gray-200 rounded-full h-2 relative overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${item.score}%` }}
                />
              </div>
              
              {/* 百分比数值 */}
              <div className="w-10 text-xs sm:text-sm font-medium text-gray-700 text-right">
                {item.score.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}