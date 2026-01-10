export enum FeedbackStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

export enum IssueType {
  TECHNICAL = 'TECHNICAL', // Kỹ thuật
  CLEANING = 'CLEANING', // Vệ sinh
  NOISE = 'NOISE', // Tiếng ồn
  SECURITY = 'SECURITY', // An ninh
  FIRE = 'FIRE', // Phòng cháy
  OTHERS = 'OTHERS', // Khác
}

export interface FeedbackImage {
  id: number;
  feedback_id: number;
  url: string;
  uploaded_at: string;
}

export interface Feedback {
  id: number;
  code: string; // Auto-generated: #PA0323
  resident_id: number;
  resident_name?: string;
  apartment?: string;
  title: string;
  description: string;
  type: IssueType;
  location: {
    building: string; // Tòa A
    floor: number; // Tầng 3
    room?: string; // Phòng 301
  };
  images: FeedbackImage[];
  status: FeedbackStatus;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  response?: string;
  rating?: number; // 1-5
  is_urgent: boolean;
  estimated_completion_date?: string;
  ticket_id?: number;
}

export interface FeedbackCategory {
  type: IssueType;
  label: string;
  icon: string; // Icon name from lucide-react-native
  color: string;
}

export const FEEDBACK_CATEGORIES: FeedbackCategory[] = [
  {
    type: IssueType.TECHNICAL,
    label: 'Kỹ thuật',
    icon: 'Wrench',
    color: '#3B82F6',
  },
  {
    type: IssueType.CLEANING,
    label: 'Vệ sinh',
    icon: 'Building',
    color: '#10B981',
  },
  {
    type: IssueType.NOISE,
    label: 'Tiếng ồn',
    icon: 'Volume2',
    color: '#F59E0B',
  },
  {
    type: IssueType.SECURITY,
    label: 'An ninh',
    icon: 'Shield',
    color: '#EF4444',
  },
  {
    type: IssueType.FIRE,
    label: 'Phòng cháy',
    icon: 'Flame',
    color: '#DC2626',
  },
  {
    type: IssueType.OTHERS,
    label: 'Khác',
    icon: 'MoreHorizontal',
    color: '#6B7280',
  },
];

export function getFeedbackStatusLabel(status: FeedbackStatus): string {
  const labels: Record<FeedbackStatus, string> = {
    [FeedbackStatus.PENDING]: 'Chờ xử lý',
    [FeedbackStatus.IN_PROGRESS]: 'Đang xử lý',
    [FeedbackStatus.RESOLVED]: 'Hoàn tất',
    [FeedbackStatus.REJECTED]: 'Từ chối',
  };
  return labels[status];
}

export function getFeedbackStatusColor(status: FeedbackStatus): string {
  const colors: Record<FeedbackStatus, string> = {
    [FeedbackStatus.PENDING]: '#F59E0B', // Orange
    [FeedbackStatus.IN_PROGRESS]: '#3B82F6', // Blue
    [FeedbackStatus.RESOLVED]: '#10B981', // Green
    [FeedbackStatus.REJECTED]: '#EF4444', // Red
  };
  return colors[status];
}

export function getIssueTypeLabel(type: IssueType): string {
  const category = FEEDBACK_CATEGORIES.find((c) => c.type === type);
  return category?.label || 'Khác';
}
