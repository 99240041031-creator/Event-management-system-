import type { Webinar, WebinarRegistration } from '@/types';

const BASE_URL = '/api'; // Relative path to use proxy

export async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Get token from localStorage
    let token = null;
    try {
        const storageItem = localStorage.getItem('auth-storage');
        if (storageItem) {
            const parsed = JSON.parse(storageItem);
            token = parsed.state?.token;
        }
    } catch (e) {
        console.error('Error parsing auth token:', e);
    }

    const headers: any = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Add timeout support
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 30000); // 30s timeout

    // console.log(`[API Debug] Fetching: ${BASE_URL}${endpoint}`);
    // if (token) {
    //     console.log('[API Debug] Token present:', token.substring(0, 10) + '...');
    // } else {
    //     console.warn('[API Debug] No token found in localStorage');
    // }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
            signal: controller.signal,
        });
        clearTimeout(id);

        // console.log(`[API Debug] Response status: ${response.status} for ${endpoint}`);

        if (response.status === 401) {
            console.error('[API Error] 401 Unauthorized - redirecting to login');
            // Auto-logout on 401
            localStorage.removeItem('auth-storage');
            window.location.href = '/login';
            throw new Error('Session expired. Please login again.');
        }

        if (!response.ok) {
            const errorText = await response.text().catch(() => '');
            console.error(`[API Error] ${response.status}: ${errorText}`);
            let errorMessage = `API Error: ${response.status}`;

            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorMessage;
            } catch (e) {
                // Ignore json parse error
            }

            throw new Error(errorMessage);
        }

        // Parse JSON
        const data = await response.json();
        // console.log(`[API Debug] Response data for ${endpoint}:`, data);

        // Check for ApiResponse wrapper
        if (data && typeof data === 'object' && 'success' in data) {
            if (data.success) {
                return data.data;
            } else {
                console.error('[API Error] Success=false:', data.message);
                throw new Error(data.message || 'API Error');
            }
        }

        // Return raw data if not wrapped (backward compatibility or external APIs)
        return data;
    } catch (error: any) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        console.error(`[API Error] Fetch error for ${endpoint}:`, error);
        throw error;
    }
}

export const supportApi = {
    create: (data: any) => api.post<any>(`/support/create?userId=${data.userId}`, data),
    getUserTickets: (userId: string) => api.get<any[]>(`/support/user/${userId}`),
    getAllTickets: () => api.get<any[]>('/support/all'),
    getTicketDetails: (ticketId: string) => api.get<any>(`/support/${ticketId}`),
    addReply: (ticketId: string, userId: string, data: any) => api.post<any>(`/support/${ticketId}/reply?userId=${userId}`, data),
    updateStatus: (ticketId: string, status: string, userId: string) => api.put<any>(`/support/${ticketId}/status?status=${status}&userId=${userId}`, {}),
    getFAQs: () => api.get<any[]>('/support/faqs'),
    createFAQ: (data: any) => api.post<any>('/support/faqs', data)
};

export const api = {
    get: <T>(endpoint: string) => fetchAPI<T>(endpoint, { method: 'GET' }),
    post: <T>(endpoint: string, body: any) => fetchAPI<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    put: <T>(endpoint: string, body: any) => fetchAPI<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    patch: <T>(endpoint: string, body: any) => fetchAPI<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: <T>(endpoint: string) => fetchAPI<T>(endpoint, { method: 'DELETE' }),
    getBlob: async (endpoint: string): Promise<Blob> => {
        let token = null;
        try {
            const storageItem = localStorage.getItem('auth-storage');
            if (storageItem) {
                const parsed = JSON.parse(storageItem);
                token = parsed.state?.token;
            }
        } catch (e) {
            console.error('Error parsing auth token:', e);
        }

        const headers: any = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return response.blob();
    },
};

// Faculty API
export const facultyApi = {
    // Dashboard
    getDashboardStats: async () => {
        try {
            return await api.get<any>('/faculty/dashboard/stats');
        } catch (error: any) {
            if (error.message?.includes('timed out') || error.message?.includes('Failed to fetch')) {
                console.warn('Backend unavailable, using mock data');
                const { mockFacultyData } = await import('./mockData');
                return mockFacultyData.dashboardStats;
            }
            throw error;
        }
    },
    getRecentActivity: async (limit: number = 10) => {
        try {
            return await api.get<any[]>(`/faculty/activity/recent?limit=${limit}`);
        } catch (error: any) {
            if (error.message?.includes('timed out') || error.message?.includes('Failed to fetch')) {
                console.warn('Backend unavailable, using mock data');
                const { mockFacultyData } = await import('./mockData');
                return mockFacultyData.recentActivity.slice(0, limit);
            }
            throw error;
        }
    },

    // Events
    getEvents: async (page: number = 0, size: number = 10) => {
        try {
            return await api.get<any>(`/faculty/events?page=${page}&size=${size}`);
        } catch (error: any) {
            if (error.message?.includes('timed out') || error.message?.includes('Failed to fetch')) {
                console.warn('Backend unavailable, using mock data');
                const { mockFacultyData } = await import('./mockData');
                return mockFacultyData.events;
            }
            throw error;
        }
    },
    createEvent: (event: any) => api.post<any>('/faculty/events', event),
    updateEvent: (id: string, event: any) => api.put<any>(`/faculty/events/${id}`, event),
    deleteEvent: (id: string) => api.delete<any>(`/faculty/events/${id}`),

    // Hackathons
    getHackathons: async (page: number = 0, size: number = 10) => {
        try {
            return await api.get<any>(`/faculty/hackathons?page=${page}&size=${size}`);
        } catch (error: any) {
            if (error.message?.includes('timed out') || error.message?.includes('Failed to fetch')) {
                console.warn('Backend unavailable, using mock data');
                const { mockFacultyData } = await import('./mockData');
                return mockFacultyData.hackathons;
            }
            throw error;
        }
    },
    createHackathon: (hackathon: any) => api.post<any>('/faculty/hackathons', hackathon),
    updateHackathon: (id: string, hackathon: any) => api.put<any>(`/faculty/hackathons/${id}`, hackathon),
    deleteHackathon: (id: string) => api.delete<any>(`/faculty/hackathons/${id}`),

    // Students
    getStudents: async () => {
        try {
            return await api.get<any[]>('/faculty/students');
        } catch (error: any) {
            if (error.message?.includes('timed out') || error.message?.includes('Failed to fetch')) {
                console.warn('Backend unavailable, using mock data');
                const { mockFacultyData } = await import('./mockData');
                return mockFacultyData.students;
            }
            throw error;
        }
    },

    // Analytics
    getAnalytics: async () => {
        try {
            return await api.get<any>('/faculty/analytics');
        } catch (error: any) {
            if (error.message?.includes('timed out') || error.message?.includes('Failed to fetch')) {
                console.warn('Backend unavailable, using mock data');
                const { mockFacultyData } = await import('./mockData');
                return mockFacultyData.analytics;
            }
            throw error;
        }
    },

    // Detailed Event Management
    getEvent: (id: string) => api.get<any>(`/faculty/events/${id}`),
    getEventRegistrations: (id: string) => api.get<any[]>(`/faculty/events/${id}/registrations`),
    markAttendance: (id: string, userIds: string[]) => api.post<any>(`/faculty/events/${id}/attendance`, { userIds }),

    // Detailed Hackathon Management
    getHackathon: (id: string) => api.get<any>(`/faculty/hackathons/${id}`),
    getHackathonTeams: (id: string) => api.get<any[]>(`/faculty/hackathons/${id}/teams`),
    getHackathonLeaderboard: (id: string) => api.get<any[]>(`/faculty/hackathons/${id}/leaderboard`),
    scoreSubmission: (id: string, scoreData: any) => api.post<any>(`/faculty/hackathons/${id}/score`, scoreData),

    // Resources
    getResources: () => api.get<any[]>('/resources'),
    deleteResource: (id: string) => api.delete<any>(`/resources/${id}`),

    // Certificates
    generateCertificates: (eventId: string, userIds: string[]) => api.post<any>('/faculty/certificates/generate', { eventId, userIds }),
    getCertificates: (page: number = 0, size: number = 10) => api.get<any>(`/faculty/certificates?page=${page}&size=${size}`),
    revokeCertificate: (id: string) => api.put<any>(`/faculty/certificates/${id}/revoke`, {}),
    getTeams: () => api.get<any[]>('/faculty/teams'),
};

export const clubApi = {
    getAll: () => api.get<any[]>('/clubs'),
    getById: (id: string) => api.get<any>(`/clubs/${id}`),
    create: (data: any) => api.post<any>('/clubs', data),
    getAnnouncements: (id: string) => api.get<any[]>(`/clubs/${id}/announcements`),
    createAnnouncement: (id: string, authorId: string, title: string, content: string) =>
        api.post<any>(`/clubs/${id}/announcements?authorId=${authorId}&title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`, {}),
    getMembers: (id: string) => api.get<any[]>(`/clubs/${id}/members`),
    getRecruitments: (id: string) => api.get<any[]>(`/clubs/${id}/recruitments`),
    getAllOpenRecruitments: () => api.get<any[]>('/clubs/recruitments/open'),
    createRecruitment: (id: string, data: { title: string; description: string; role: string; requirements: string; deadline: string }) =>
        api.post<any>(`/clubs/${id}/recruitments?title=${encodeURIComponent(data.title)}&description=${encodeURIComponent(data.description)}&role=${encodeURIComponent(data.role)}&requirements=${encodeURIComponent(data.requirements)}&deadline=${data.deadline}`, {}),
    submitJoinRequest: (id: string, userId: string, message: string) =>
        api.post<any>(`/clubs/${id}/join-requests?userId=${userId}`, message),
    getJoinRequests: (id: string) => api.get<any[]>(`/clubs/${id}/join-requests`),
    updateJoinRequestStatus: (requestId: string, status: string) =>
        api.put<any>(`/clubs/join-requests/${requestId}/status?status=${status}`, {}),
    getEvents: (id: string) => api.get<any[]>(`/clubs/${id}/events`),
    getHackathons: (id: string) => api.get<any[]>(`/clubs/${id}/hackathons`),
    getResources: (id: string) => api.get<any[]>(`/clubs/${id}/resources`),
    getDiscussions: (id: string) => api.get<any[]>(`/clubs/${id}/discussions`),
    createDiscussion: (clubId: string, data: { authorId: string; title: string; content: string }) => api.post<any>(`/clubs/${clubId}/discussions`, data),
    getAnalytics: (id: string) => api.get<any>(`/clubs/${id}/analytics`),
};

export const eventTeamApi = {
    getAll: (eventId: string) => api.get<any[]>(`/events/${eventId}/team`),
    addMember: (eventId: string, data: { userId: string; role: string }) => api.post<any>(`/events/${eventId}/team`, data),
    removeMember: (eventId: string, userId: string) => api.delete<any>(`/events/${eventId}/team/${userId}`),
};

export const eventApi = {
    getAll: async () => {
        const response: any = await api.get<any>('/events');
        return response.content || response;
    },
    getById: (id: string) => api.get<any>(`/events/${id}`),
    create: (data: any) => api.post<any>('/events', data),
    register: (id: string, userId: string) => api.post<any>(`/events/${id}/register?userId=${userId}`, {}),
    unregister: (id: string, userId: string) => api.post<any>(`/events/${id}/unregister?userId=${userId}`, {}),
    getStudentEvents: (userId: string) => api.get<any[]>(`/events/student/${userId}`),
    getOrganizerEvents: (organizerId: string) => api.get<any[]>(`/events/organizer/${organizerId}`),
    seedRegistrations: (userId: string) => api.post<any>(`/events/seed-registrations?userId=${userId}`, {}),
};
export const webinarApi = {
    getAll: (userId?: string) => api.get<Webinar[]>(`/webinars${userId ? `?userId=${userId}` : ''}`),
    getById: (id: string, userId?: string) => api.get<Webinar>(`/webinars/${id}${userId ? `?userId=${userId}` : ''}`),
    create: (userId: string, data: any) => api.post<Webinar>(`/webinars/create?userId=${userId}`, data),
    update: (id: string, data: any) => api.put<Webinar>(`/webinars/${id}/update`, data),
    cancel: (id: string) => api.post<void>(`/webinars/${id}/cancel`, {}),
    delete: (id: string) => api.delete<void>(`/webinars/${id}/delete`),
    register: (id: string, userId: string) => api.post<void>(`/webinars/${id}/register?userId=${userId}`, {}),
    unregister: (id: string, userId: string) => api.delete<void>(`/webinars/${id}/unregister?userId=${userId}`),
    join: (id: string, userId: string) => api.post<{ url: string }>(`/webinars/${id}/join?userId=${userId}`, {}),
    getMyRegistrations: (userId: string) => api.get<WebinarRegistration[]>(`/webinars/student/my?userId=${userId}`),
    getMyRegistrationsNew: (userId: string) => api.get<WebinarRegistration[]>(`/webinars/api/student/webinars?userId=${userId}`),
    submitFeedback: (id: string, userId: string, data: { rating: number; comment: string }) =>
        api.post<void>(`/webinars/${id}/feedback?userId=${userId}`, data),
    generateCertificate: (id: string, userId: string) => api.post<{ url: string }>(`/webinars/${id}/certificate?userId=${userId}`, {}),
    generateCertificateBlob: (id: string, userId: string) => api.getBlob(`/webinars/${id}/certificate/download?userId=${userId}`),
    getAnalytics: () => api.get<any>('/webinars/analytics'),
    seed: () => api.post<any>('/webinars/seed', {}),
};

export const analyticsApi = {
    getStudentStats: (userId: string) => api.get<any>(`/analytics/student/${userId}`),
    getCollegeRankings: () => api.get<any[]>('/analytics/rankings/colleges'),
};

export const submissionApi = {
    submit: (data: any) => api.post<any>('/submissions', data),
    getById: (id: string) => api.get<any>(`/submissions/${id}`),
    getByHackathon: (id: string) => api.get<any[]>(`/submissions/hackathon/${id}`),
    update: (id: string, data: any) => api.put<any>(`/submissions/${id}`, data),
};

export const hackathonApi = {
    getAll: () => api.get<any[]>('/hackathons'),
    getById: (id: string) => api.get<any>(`/hackathons/${id}`),
    create: (data: any) => api.post<any>('/hackathons', data),
    getProblemStatements: (id: string) => api.get<any[]>(`/hackathons/${id}/problem-statements`),
    addProblemStatement: (id: string, data: any) => api.post<any>(`/hackathons/${id}/problem-statements`, data),
    createTeam: (id: string, name: string, leaderId: string) => api.post<any>(`/hackathons/${id}/teams`, { name, leaderId }),
    joinTeam: (id: string, userId: string, joinCode: string) => api.post<any>(`/hackathons/${id}/teams/join`, { userId, joinCode }),
    getMyTeam: (id: string, userId: string) => api.get<any>(`/hackathons/${id}/my-team?userId=${userId}`),
    getTeamMembers: (teamId: string) => api.get<any[]>(`/hackathons/teams/${teamId}/members`),
    getResults: (id: string) => api.get<any[]>(`/hackathons/${id}/results`),
    getRegistered: (userId: string) => api.get<any[]>(`/hackathons/student/${userId}/registered`),
    getCompleted: (userId: string) => api.get<any[]>(`/hackathons/student/${userId}/completed`),
    getRecommendations: (userId: string) => api.get<any[]>(`/hackathons/recommendations/${userId}`),

    // New Endpoints
    filter: (params: any) => {
        const query = new URLSearchParams(params).toString();
        return api.get<any[]>(`/hackathons/filter?${query}`);
    },
    bookmark: (id: string, userId: string) => api.post<any>(`/hackathons/${id}/bookmark?userId=${userId}`, {}),
    getBookmarks: (userId: string) => api.get<any[]>(`/hackathons/bookmarks?userId=${userId}`),
    seed: () => api.post<any>('/hackathons/seed', {}),
};

export const certificateApi = {
    getUserCertificates: (userId: string) => api.get<any[]>(`/student/certificates?userId=${userId}`),
    getById: (id: string, userId: string) => api.get<any>(`/certificates/${id}?userId=${userId}`),
    download: (id: string, userId: string) => api.getBlob(`/certificates/${id}/download?userId=${userId}`),
    verify: (certificateId: string) => api.get<any>(`/certificates/verify/${certificateId}`),
    seed: (userId: string) => api.post<string>(`/certificates/seed?userId=${userId}`, {}),
};

export const notificationApi = {
    getByUser: (userId: string) => api.get<any[]>(`/notifications/user/${userId}`),
    getUnreadCount: (userId: string) => api.get<number>(`/notifications/user/${userId}/unread-count`),
    markAsRead: (id: string) => api.put<void>(`/notifications/${id}/read`, {}),
    markAllAsRead: (userId: string) => api.put<void>(`/notifications/user/${userId}/read-all`, {}),
};

export const chatApi = {
    getRoom: (type: string, targetId: string, name: string) => api.get<any>(`/chat/rooms/${type}/${targetId}?name=${encodeURIComponent(name)}`),
    getMessages: (roomId: string) => api.get<any[]>(`/chat/messages/${roomId}`),
};

export const forumApi = {
    getPosts: () => api.get<any[]>('/forum/posts'),
    getPost: (id: string) => api.get<any>(`/forum/posts/${id}`),
    createPost: (authorId: string, title: string, content: string, category: string) => api.post<any>('/forum/posts', { authorId, title, content, category }),
    upvotePost: (id: string) => api.post<any>(`/forum/posts/${id}/upvote`, {}),
    downvotePost: (id: string) => api.post<any>(`/forum/posts/${id}/downvote`, {}),
    addComment: (id: string, authorId: string, content: string) => api.post<any>(`/forum/posts/${id}/comments`, { authorId, content }),
    getComments: (id: string) => api.get<any[]>(`/forum/posts/${id}/comments`),
};

export const activityApi = {
    getByUser: (userId: string) => api.get<any[]>(`/activities/user/${userId}`),
    getAll: () => Promise.resolve([]),
};

export const complaintApi = {
    submit: (data: { userId: string; type: string; subject: string; description: string }) => api.post<any>('/complaints', data),
    getByUser: (userId: string) => api.get<any[]>(`/complaints/user/${userId}`),
    getAll: () => api.get<any[]>('/complaints'),
    updateStatus: (id: string, data: { status: string; adminAction: string }) => api.patch<any>(`/complaints/${id}/status`, data),
};

export const feedbackApi = {
    submit: (data: { eventId: string; userId: string; rating: number; comment: string; suggestions?: string }) => api.post<any>('/feedback/event', data),
    getByEvent: (eventId: string) => api.get<any[]>(`/feedback/event/${eventId}`),
};

export const studentTeamApi = {
    getMyTeams: (userId: string) => api.get<any[]>(`/student/teams?userId=${userId}`),
    getTeam: (id: string) => api.get<any>(`/student/team/${id}`),
    createTeam: (userId: string, data: any) => api.post<any>(`/student/team/create?userId=${userId}`, data),
    getInvites: (userId: string) => api.get<any[]>(`/student/team/invites?userId=${userId}`),
    inviteMember: (id: string, email: string) => api.post<any>(`/student/team/${id}/invite`, { email }),
    acceptInvite: (id: string, userId: string) => api.post<any>(`/student/team/${id}/accept?userId=${userId}`, {}),
    leaveTeam: (id: string, userId: string) => api.post<any>(`/student/team/${id}/leave?userId=${userId}`, {}),
    submitProject: (id: string, data: any) => api.post<any>(`/student/team/${id}/submit`, data),
    chat: (id: string, userId: string, content: string, type: string = 'TEXT') =>
        api.post<any>(`/student/team/${id}/chat?userId=${userId}`, { content, type }),
};
