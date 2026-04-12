import type { Event } from './index';

export interface AmbassadorMetrics {
  id: string;
  totalReferrals: number;
  successfulRegistrations: number;
  successfulParticipations: number;
  conversionRate: number;
  dropOffRate: number;
  rewardPoints: number;
  ambassadorRank: number;
  externalCollegeReach: number;
  updatedAt: string;
}

export interface StudentReferral {
  id: string;
  referredUser: {
    id: string;
    name: string;
    email: string;
    college?: string;
  };
  conversionStatus: 'CLICK' | 'REGISTERED' | 'PARTICIPATED' | 'COMPLETED';
  referralDate: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    role: string;
  };
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  messages: ChatMessage[];
  lastMessageAt: string;
}

export interface DetailedAnalytics {
  referralFunnel: {
    stage: string;
    count: number;
  }[];
  weeklyEngagement: {
    day: string;
    clicks: number;
    tasks: number;
  }[];
  collegeReach: {
    college: string;
    count: number;
    conversion: number;
  }[];
}

export interface ReferralCampaign {
  id: string;
  name: string;
  description?: string;
  targetAudience?: string;
  event?: Event;
  eventId?: string;
  referralLink: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  clickCount: number;
  registrationCount: number;
  startDate: string;
  endDate?: string;
}

export interface ReferralRecord {
  id: string;
  campaignId: string;
  referredUserId?: string;
  visitorIp?: string;
  conversionStatus: 'CLICKED' | 'REGISTERED' | 'PARTICIPATED' | 'COMPLETED';
  clickedAt: string;
  registeredAt?: string;
}

export interface RewardTransaction {
  id: string;
  pointsAwarded: number;
  eventType: 'REGISTRATION' | 'PARTICIPATION' | 'BONUS';
  description: string;
  awardedAt: string;
}
