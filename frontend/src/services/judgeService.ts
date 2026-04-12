import { api } from '@/lib/api';
import { MOCK_CONFIG } from '@/config/mockConfig';
import { mockData } from '@/constants/mockData';
import { toNumericId } from '@/utils/idUtils';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface JudgeStats {
    assignedEvents: number;
    pendingEvaluations: number;
    completedEvaluations: number;
}

export interface EvaluationPayload {
    criteriaScores: string; // JSON string
    totalScore: number;
    feedback: string;
    isDraft: boolean;
}

export const judgeService = {
    getDashboardStats: async () => {
        return await api.get<JudgeStats>('/judge/dashboard/stats');
    },

    getAssignedEvents: async () => {
        return await api.get<any[]>('/judge/events');
    },

    getEventSubmissions: async (eventId: string) => {
        return await api.get<any[]>(`/submissions/event/${toNumericId(eventId)}`);
    },

    submitEvaluation: async (submissionId: string, payload: EvaluationPayload) => {
        return await api.post<any>(`/evaluation/submit/${toNumericId(submissionId)}`, payload);
    },

    getSubmissionScore: async (submissionId: string) => {
        return await api.get<any>(`/evaluation/submission/${toNumericId(submissionId)}`);
    },

    lockEventScores: async (eventId: string) => {
        return await api.put<any>(`/evaluation/lock/${toNumericId(eventId)}`, {});
    },

    getLockStatus: async (eventId: string) => {
        if (MOCK_CONFIG.USE_MOCK) {
            return false;
        }
        return await api.get<boolean>(`/evaluation/lock/${toNumericId(eventId)}/status`);
    },

    getRubric: async (eventId: string) => {
        return await api.get<any[]>(`/evaluation/rubric/${toNumericId(eventId)}`);
    },

    getPendingEvaluations: async (eventId: string) => {
        if (MOCK_CONFIG.USE_MOCK) {
            await sleep(MOCK_CONFIG.DELAY_MS);
            return mockData.evaluations;
        }
        return await api.get<any[]>(`/evaluation/pending/${toNumericId(eventId)}`);
    },

    getPendingSummary: async () => {
        return await api.get<any[]>('/evaluation/pending-summary');
    },

    getAvailableJudges: async () => {
        if (MOCK_CONFIG.USE_MOCK) {
            await sleep(MOCK_CONFIG.DELAY_MS);
            return mockData.judges;
        }
        return await api.get<any[]>('/evaluation/judges');
    },

    assignJudgeToEvent: async (eventId: string, judgeId: string) => {
        return await api.post<any>(`/evaluation/assign/${toNumericId(eventId)}?judgeId=${toNumericId(judgeId)}`, {});
    },

    getLeaderboard: async (eventId: string) => {
        return await api.get<any[]>(`/evaluation/leaderboard/${toNumericId(eventId)}`);
    }
};
