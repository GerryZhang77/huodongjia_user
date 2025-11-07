import { create } from 'zustand';
import type { Activity, Enrollment, MatchResult } from '@/types';

interface ActivityState {
  activities: Activity[];
  currentActivity: Activity | null;
  enrollments: Enrollment[];
  matchResults: MatchResult | null;
  setActivities: (activities: Activity[]) => void;
  setCurrentActivity: (activity: Activity | null) => void;
  setMatchResults: (results: MatchResult | null) => void;
  addEnrollment: (enrollment: Enrollment) => void;
  submitEnrollment?: (activityId: string, formData: any) => Promise<void>;
}

// Mock activities data
const mockActivities: Activity[] = [
  {
    id: '1',
    title: '北京大学学生创新学社秋季骨干迎新会',
    cover_image: '/ma.png',
    start_time: '2024-12-15T14:00:00Z',
    end_time: '2024-12-15T18:00:00Z',
    location: 'Wespace轰趴营地',
    max_participants: 220,
    current_participants: 185,
    fee: 0,
    description: '欢迎新骨干加入学社大家庭，通过互动匹配认识志同道合的伙伴',
    tags: ['骨干迎新', '创新创业', '互动匹配'],
    organizer: {
      id: 'org1',
      name: '北京大学学生创新学社',
      avatar: '/logo.png'
    },
    status: 'published'
  },
  {
    id: '2',
    title: '科技创新交流会',
    cover_image: undefined,
    start_time: '2024-12-20T09:00:00Z',
    end_time: '2024-12-20T17:00:00Z',
    location: '上海国际会议中心',
    max_participants: 120,
    current_participants: 85,
    fee: 199,
    description: '汇聚科技精英，分享创新理念，探讨未来趋势',
    tags: ['技术', '创新', '交流'],
    organizer: {
      id: 'org2',
      name: '科技创新协会',
      avatar: undefined
    },
    status: 'published'
  },
  {
    id: '3',
    title: '设计师沙龙',
    cover_image: undefined,
    start_time: '2024-12-25T14:30:00Z',
    end_time: '2024-12-25T18:00:00Z',
    location: '深圳设计中心',
    max_participants: 50,
    current_participants: 42,
    fee: 99,
    description: '设计师聚会，分享设计心得，展示优秀作品',
    tags: ['设计', 'UI/UX', '创意'],
    organizer: {
      id: 'org3',
      name: '设计师联盟',
      avatar: undefined
    },
    status: 'published'
  }
];

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: mockActivities,
  currentActivity: null,
  enrollments: [],
  matchResults: null,

  setActivities: (activities) => set({ activities }),

  setCurrentActivity: (activity) => set({ currentActivity: activity }),

  setMatchResults: (results) => set({ matchResults: results }),

  addEnrollment: (enrollment) => {
    const currentEnrollments = get().enrollments;
    set({ enrollments: [...currentEnrollments, enrollment] });
  },

  submitEnrollment: async (activityId: string, formData: any) => {
    // Mock implementation
    console.log('Submitting enrollment:', { activityId, formData });
    // In real implementation, this would call the API
    return Promise.resolve();
  },
}));

export default useActivityStore;