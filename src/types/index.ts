// 用户相关类型定义
export interface User {
  id: string;
  phone?: string;
  name: string;
  slug?: string;
  title?: string;
  user_type: 'user' | 'organizer' | 'admin';
  age?: number;
  occupation?: string;
  company?: string;
  tags: string[];
  interests?: string[];
  education?: string;
  location?: string;
  skills?: string[];
  wechat_qr?: string;
  avatar?: string;
  bio?: string;
}

// 用于 /api/auth/me 接口的用户信息类型
export interface AuthMeUser {
  id: string;
  account: string;
  name: string;
  age?: number | null;
  phone?: string | null;
  email: string;
  occupation: string;
  company: string;
  user_type: 'user' | 'organizer' | 'admin';
  biograph: string;
  tags: string;
  wechat_qr?: string | null;
  // 新增字段，基于API实际返回的数据结构
  major?: string;
  grade?: string;
  department?: string;
  industry?: string;
  advantage?: string;
  proudest_thing?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthMeResponse {
  success: boolean;
  user: AuthMeUser;
}

// 活动相关类型定义
export interface Activity {
  id: string;
  title: string;
  cover_image?: string;
  start_time: string;
  end_time?: string;
  location: string;
  max_participants: number;
  current_participants: number;
  fee: number;
  description: string;
  tags: string[];
  organizer: {
    id: string;
    name: string;
    avatar?: string;
  };
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
}

// 报名相关类型定义
export interface Enrollment {
  id: string;
  activity_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  form_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// 匹配相关类型定义
export interface MatchResult {
  activityId: string;
  matchedAt: string;
  isPublished: boolean;
  groups: MatchGroup[];
  ungroupedMembers: Member[];
  statistics: {
    totalGroups: number;
    totalMembers: number;
    ungroupedCount: number;
    averageScore: number;
    minScore: number;
    maxScore: number;
  };
}

export interface MatchGroup {
  groupId: string;
  groupName: string;
  members: GroupMember[];
  isLocked: boolean;
  score: number;
  description?: string;
  relevanceScore?: number;
  memberCount: number;
}

export interface GroupMember {
  enrollmentId: string;
  name: string;
  position?: number;
  avatar?: string;
  tags: string[];
  role?: string;
  company?: string;
  commonTags?: string[];
  matchScore?: number;
}

export interface Member {
  id: string;
  name: string;
  avatar?: string;
  tags: string[];
  role?: string;
  company?: string;
  bio?: string;
  isFromSameCity?: boolean;
}

// 匹配分析相关类型定义
export interface MatchAnalysis {
  overallScore: number;
  dimensions: MatchDimension[];
  commonTags: string[];
  complementaryTags: string[];
  suggestedTopics: string[];
  compatibility: {
    interest: number;
    industry: number;
    location: number;
    experience: number;
  };
  highlights?: string[];
  suggestions?: string[];
  totalMatches?: number;
  highQualityMatches?: number;
  generatedAt?: string;
}

export interface MatchDimension {
  name: string;
  score: number;
  description: string;
  color: string;
}

// 消息通知相关类型定义
export interface Notification {
  id: string;
  type: 'system' | 'greeting' | 'activity' | 'match';
  title: string;
  content: string;
  isRead: boolean;
  created_at: string;
  data?: Record<string, any>;
}

// 互动相关类型定义
export interface Interaction {
  id: string;
  from_user_id: string;
  to_user_id: string;
  type: 'greeting' | 'contact_exchange' | 'like';
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

// API响应类型定义
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 登录相关类型定义
export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    phone?: string | null;
    name: string;
    user_type: 'user' | 'organizer' | 'admin';
    age?: number | null;
    occupation?: string;
    company?: string;
    tags: string;
    wechat_qr?: string | null;
  };
}

// 报名表单类型定义
export interface EnrollmentForm {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  occupation?: string;
  tags: string[];
  bio?: string;
  expectations?: string;
  experience?: string;
  additionalInfo?: string;
  reason?: string;
}

// 路由参数类型定义
export interface RouteParams {
  id?: string;
  slug?: string;
  groupId?: string;
}

// 组件Props类型定义
export interface ActivityStatusProps {
  activity: Activity;
  enrollment?: Enrollment;
  onEnroll: () => void;
  onEnterActivity: () => void;
}

export interface MatchClusterCardProps {
  group: MatchGroup;
  onClick: (groupId: string) => void;
}

export interface MemberCardProps {
  member: Member | GroupMember;
  onClick: (memberId: string) => void;
  showMatchScore?: boolean;
}

export interface MatchAnalysisProps {
  analysis: MatchAnalysis;
  targetUser: User;
}

// 状态管理类型定义
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export interface ActivityState {
  activities: Activity[];
  currentActivity: Activity | null;
  enrollments: Enrollment[];
  matchResults: MatchResult | null;
  setCurrentActivity: (activity: Activity) => void;
  setMatchResults: (results: MatchResult) => void;
  addEnrollment: (enrollment: Enrollment) => void;
  submitEnrollment?: (activityId: string, formData: EnrollmentForm) => Promise<void>;
}

// 表单验证类型定义
export interface FormErrors {
  [key: string]: string | undefined;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | undefined;
}

// 筛选和排序类型定义
export interface FilterOptions {
  role?: string[];
  sameCity?: boolean;
  sameSchool?: boolean;
  tags?: string[];
}

export interface SortOption {
  key: 'matchScore' | 'similarity' | 'complementarity' | 'sameCity';
  label: string;
  direction: 'asc' | 'desc';
}

// 聚类成员列表相关类型定义
export interface ClusterMember {
  id: string;
  slug: string;
  name: string;
  nickname?: string;
  avatar?: string;
  role?: string;
  company?: string;
  location?: string;
  isLocal: boolean;
  commonTags: string[];
  suggestedTopic: string;
}

export interface ClusterMembersResponse {
  success: boolean;
  data: {
    members: ClusterMember[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
      hasMore: boolean;
    };
    cluster: {
      id: string;
      name: string;
      description: string;
      memberCount: number;
      color?: string;
      matchScore?: number;
      tags?: string[];
    };
  };
}

export interface MatchCluster {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  matchScore: number;
  tags: string[];
  color: string;
  commonInterests?: string[];
  commonLocation?: string;
  members?: ClusterMember[];
}

// 新增：活动匹配结果API响应类型
export interface ActivityMatchResultsResponse {
  success: boolean;
  message: string;
  data: {
    weights: number[];
    activityId: string;
    groups: ActivityMatchGroup[];
  };
}

export interface ActivityMatchGroup {
  groupId: number;
  groupName: string;
  members: ActivityMatchMember[];
}

export interface ActivityMatchMember {
  id: string;
  age: number | null;
  sex: string;
  tel: string | null;
  name: string;
  email: string | null;
  score: number;
  status: string;
  user_id: string;
  biograph: string;
  event_id: string;
  location: string | null;
  created_at: string;
  occupation: string;
  other_info: string;
  student_id: string;
  updated_at: string;
  enrollmentId: string;
}

// 新增：匹配规则API响应类型
export interface MatchRulesResponse {
  success: boolean;
  message: string;
  data: {
    rules: MatchRule[];
    totalWeight: number;
    enabledCount: number;
    updatedAt: string;
  };
}

export interface MatchRule {
  id: string;
  name: string;
  description: string;
  type: string;
  field: string;
  weight: number;
  enabled: boolean;
  config: {
    method: string;
  };
}