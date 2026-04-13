export const mockData = {
    summary: {
        totalFaculty: 25,
        totalStudents: 480,
        activeClubs: 8,
        totalEvents: 12,
        totalHackathons: 10,
        pendingApprovals: 6,
        pendingCredits: 3
    },
    approvals: {
        events: [
            { id: 'ev-101', dbId: 101, title: 'Tech Symposium 2026', status: 'PENDING', submittedBy: 'faculty@college.edu', date: '2026-04-15' },
            { id: 'ev-102', dbId: 102, title: 'Annual Cultural Fest', status: 'PENDING', submittedBy: 'admin@college.edu', date: '2026-05-20' }
        ],
        hackathons: [
            { id: 'hk-201', dbId: 201, title: 'Titan Shield: National Cyber Battle', approvalStatus: 'PENDING', submittedBy: 'super@platform.com', date: '2026-06-10' },
            { id: 'hk-202', dbId: 202, title: 'Green Horizon: Eco-Tech Sprint', approvalStatus: 'PENDING', submittedBy: 'faculty@college.edu', date: '2026-07-05' },
            { id: 'hk-203', dbId: 203, title: 'DeFi Frontier: FinTech 2.0', approvalStatus: 'PENDING', submittedBy: 'judge@hackathon.com', date: '2026-08-15' },
            { id: 'hk-204', dbId: 204, title: 'Infinite Worlds: GameDev Arena', approvalStatus: 'PENDING', submittedBy: 'admin@college.edu', date: '2026-09-20' },
            { id: 'hk-205', dbId: 205, title: 'VitalLink: HealthTech Connect', approvalStatus: 'PENDING', submittedBy: 'super@platform.com', date: '2026-10-12' }
        ]
    },
    faculty: [
        { id: 'f-001', dbId: 1, firstName: 'Dr.', lastName: 'Kumar', email: 'kumar@college.edu', subject: 'AI', attendance: 92, classesHandled: 4, points: 1560, streak: 12 },
        { id: 'f-002', dbId: 2, firstName: 'Ms.', lastName: 'Priya', email: 'priya@college.edu', subject: 'DBMS', attendance: 88, classesHandled: 3, points: 1240, streak: 8 },
        { id: 'f-003', dbId: 3, firstName: 'Mr.', lastName: 'Rajesh', email: 'rajesh@college.edu', subject: 'Operating Systems', attendance: 85, classesHandled: 5, points: 980, streak: 5 }
    ],
    students: [
        { id: 's-001', dbId: 1, student: { email: 'rahul@student.edu' }, subject: { name: 'AI' }, internalMarks: 25, externalMarks: 60, totalScore: 85, passStatus: 'PASS' },
        { id: 's-002', dbId: 2, student: { email: 'ananya@student.edu' }, subject: { name: 'AI' }, internalMarks: 12, externalMarks: 30, totalScore: 42, passStatus: 'FAIL' },
        { id: 's-003', dbId: 3, student: { email: 'sid@student.edu' }, subject: { name: 'DBMS' }, internalMarks: 20, externalMarks: 55, totalScore: 75, passStatus: 'PASS' },
        { id: 's-004', dbId: 4, student: { email: 'kritika@student.edu' }, subject: { name: 'OS' }, internalMarks: 10, externalMarks: 25, totalScore: 35, passStatus: 'FAIL' }
    ],
    syllabus: [
        { id: 'sy-1', dbId: 1, subject: { name: 'AI' }, faculty: { email: 'kumar@college.edu' }, completionPercentage: 75, lastTopicCovered: 'Neural Networks', status: 'ON_TRACK' },
        { id: 'sy-2', dbId: 2, subject: { name: 'DBMS' }, faculty: { email: 'priya@college.edu' }, completionPercentage: 60, lastTopicCovered: 'Normalization', status: 'ON_TRACK' },
        { id: 'sy-3', dbId: 3, subject: { name: 'OS' }, faculty: { email: 'rajesh@college.edu' }, completionPercentage: 80, lastTopicCovered: 'Deadlock Prevention', status: 'ON_TRACK' }
    ],
    credits: [
        { id: 'cr-1', dbId: 1, student: { email: 'rahul@student.edu' }, event: 'Titan Shield', pointsRequested: 200, reason: 'Won First Prize', status: 'PENDING' },
        { id: 'cr-2', dbId: 2, student: { email: 'ananya@student.edu' }, event: 'Tech Symposium', pointsRequested: 50, reason: 'Volunteer', status: 'PENDING' },
        { id: 'cr-3', dbId: 3, student: { email: 'sid@student.edu' }, event: 'DeFi Frontier', pointsRequested: 100, reason: 'Finalist', status: 'PENDING' }
    ],
    judges: [
        { id: 'j-1', name: 'Dr. Anita Desai', email: 'anita@judge.com', department: 'Computer Science', joinedAt: '2025-01-10', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anita' },
        { id: 'j-2', name: 'Prof. Mark Wood', email: 'mark@external.com', department: 'External (Google)', joinedAt: '2025-02-15', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mark' }
    ],
    evaluations: [
        { 
            id: 'ev-1', 
            judge: { name: 'Dr. Anita Desai' }, 
            submission: { id: 'sub-101', projectTitle: 'AI Health Guard', event: { title: 'Titan Shield' } }, 
            criteriaScores: '{"Innovation": 25, "Technical": 24, "Pitch": 25}', 
            totalScore: 74 
        },
        { 
            id: 'ev-2', 
            judge: { name: 'Prof. Mark Wood' }, 
            submission: { id: 'sub-102', projectTitle: 'Secure Chain', event: { title: 'Titan Shield' } }, 
            criteriaScores: '{"Innovation": 20, "Technical": 22, "Pitch": 18}', 
            totalScore: 60 
        }
    ]
};
