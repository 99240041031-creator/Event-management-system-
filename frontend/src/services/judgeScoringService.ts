import { api } from '@/lib/api';

export interface CriteriaScore {
    [key: string]: number;
}

export interface SubmitScorePayload {
    submissionId: string;
    roundId: string;
    criteriaScores: CriteriaScore;
    feedback: string;
    isFinal: boolean;
}

export interface HackathonRound {
    id: string;
    roundNumber: number;
    name: string;
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
    criteria: string; // JSON
}

export const judgeScoringService = {
    submitScore: async (payload: SubmitScorePayload) => {
        return await api.post<any>('/scoring/submit', payload);
    },

    getHackathonRounds: async (hackathonId: string) => {
        return await api.get<HackathonRound[]>(`/scoring/hackathon/${hackathonId}/rounds`);
    },

    getRoundDetails: async (roundId: string) => {
        return await api.get<HackathonRound>(`/scoring/round/${roundId}`);
    },

    getLeaderboard: async (hackathonId: string) => {
        return await api.get<any[]>(`/scoring/leaderboard/${hackathonId}`);
    },

    getAnalytics: async (hackathonId: string) => {
        return await api.get<any>(`/scoring/analytics/${hackathonId}`);
    },

    downloadReport: async (hackathonId: string) => {
        const blob = await api.getBlob(`/scoring/report/${hackathonId}`);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `leaderboard-${hackathonId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
};
