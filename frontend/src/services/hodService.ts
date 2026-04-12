import { api } from '@/lib/api';
import { MOCK_CONFIG } from '@/config/mockConfig';
import { mockData } from '@/constants/mockData';
import { toNumericId } from '@/utils/idUtils';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const hodService = {
  getSummary: async () => {
    if (MOCK_CONFIG.USE_MOCK) {
        await sleep(MOCK_CONFIG.DELAY_MS);
        return mockData.summary;
    }
    return api.get<any>('/hod/dashboard/summary');
  },
  
  getFacultyStatus: async () => {
    if (MOCK_CONFIG.USE_MOCK) {
        await sleep(MOCK_CONFIG.DELAY_MS);
        return mockData.faculty;
    }
    return api.get<any[]>('/hod/faculty');
  },
  
  getStudentStatus: async () => {
    if (MOCK_CONFIG.USE_MOCK) {
        await sleep(MOCK_CONFIG.DELAY_MS);
        return mockData.students;
    }
    return api.get<any[]>('/hod/students');
  },
  getStudentExams: async () => {
    if (MOCK_CONFIG.USE_MOCK) {
        await sleep(MOCK_CONFIG.DELAY_MS);
        return mockData.students;
    }
    return api.get<any[]>('/hod/students/exams');
  },
  
  getSyllabusProgress: async () => {
    if (MOCK_CONFIG.USE_MOCK) {
        await sleep(MOCK_CONFIG.DELAY_MS);
        return mockData.syllabus;
    }
    return api.get<any[]>('/hod/syllabus');
  },
  
  getCreditRequests: async () => {
    if (MOCK_CONFIG.USE_MOCK) {
        await sleep(MOCK_CONFIG.DELAY_MS);
        return mockData.credits;
    }
    return api.get<any[]>('/hod/credits');
  },
  approveCreditRequest: (id: string) => api.put<any>(`/hod/credits/${toNumericId(id)}/approve`, {}),
  rejectCreditRequest: (id: string) => api.put<any>(`/hod/credits/${toNumericId(id)}/reject`, {}),

  getApprovals: async () => {
    if (MOCK_CONFIG.USE_MOCK) {
        await sleep(MOCK_CONFIG.DELAY_MS);
        return mockData.approvals;
    }
    return api.get<any>('/hod/approvals');
  },
  handleApproval: (id: string, type: string, action: string) => {
    const numericId = toNumericId(id);
    return api.put<any>(`/hod/approvals/${numericId}?type=${type}&action=${action}`, {});
  }
};
