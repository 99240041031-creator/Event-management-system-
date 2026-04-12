import React from 'react';
import { useAuthStore } from '@/store';
import StudentTeamsPage from './StudentTeamsPage';
import FacultyTeamsPage from './FacultyTeamsPage';

const TeamsPage = () => {
    const role = useAuthStore((state) => state.user?.role);
    const isFaculty = role === 'faculty';
    
    // We already ensure the user is authenticated in ProtectedRoute.
    return isFaculty ? <FacultyTeamsPage /> : <StudentTeamsPage />;
};

export default TeamsPage;
