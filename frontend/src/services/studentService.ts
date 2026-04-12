import { fetchAPI } from '@/lib/api';

export interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  bio?: string;
  skills?: string;
  department?: string;
  role: string;
  points: number;
  streak: number;
  academicYear?: number;
  collegeId?: string;
  collegeName?: string;
  departmentId?: string;
  departmentName?: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  bio?: string;
  skills?: string;
  avatar?: string;
  department?: string;
}

export const studentService = {
  getProfile: (userId: string): Promise<StudentProfile> =>
    fetchAPI<StudentProfile>(`/student/profile/${userId}`),

  getMe: (): Promise<StudentProfile> =>
    fetchAPI<StudentProfile>('/student/me'),

  updateProfile: (userId: string, payload: UpdateProfilePayload): Promise<StudentProfile> =>
    fetchAPI<StudentProfile>(`/student/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  getStats: (userId: string): Promise<{ points: number; streak: number }> =>
    fetchAPI(`/student/stats/${userId}`),
};
