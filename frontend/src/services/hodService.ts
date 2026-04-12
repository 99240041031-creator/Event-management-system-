import { api } from '../lib/api';

export interface HodStats {
    totalStudents: number;
    totalFaculty: number;
    activeClubs: number;
    runningEvents: number;
    ongoingHackathons: number;
    healthScore: number;
}

export interface FacultySummary {
    id: string;
    name: string;
    email: string;
    eventsManaged: number;
    performanceScore: number;
    status: 'RISK' | 'STABLE';
}

export interface StudentSummary {
    id: string;
    name: string;
    email: string;
    year: number;
    participationCount: number;
    engagementScore: number;
    status: 'LOW_ENGAGEMENT' | 'ACTIVE';
}

export interface ApprovalRequest {
    id: string;
    type: 'EVENT' | 'BUDGET' | 'CREDIT' | 'CLUB' | 'HACKATHON';
    referenceId: string;
    submittedBy: { name: string; email: string };
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    remarks: string;
    createdAt: string;
}

export const hodService = {
    getDashboardStats: (departmentId: string) =>
        api.get<HodStats>(`/hod/dashboard/stats?departmentId=${departmentId}`),

    getFacultyMonitoring: (departmentId: string) =>
        api.get<FacultySummary[]>(`/hod/faculty?departmentId=${departmentId}`),

    getStudentMonitoring: (departmentId: string) =>
        api.get<StudentSummary[]>(`/hod/students?departmentId=${departmentId}`),

    getPendingApprovals: (hodId: string) =>
        api.get<ApprovalRequest[]>(`/hod/approvals?hodId=${hodId}`),

    processApproval: (id: string, status: 'APPROVED' | 'REJECTED', remarks: string) =>
        api.post(`/hod/approvals/${id}/process?status=${status}`, { remarks }),

    getDetailedHealth: (departmentId: string) =>
        api.get<any>(`/hod/health?departmentId=${departmentId}`)
};
