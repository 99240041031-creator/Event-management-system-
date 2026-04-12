// User Roles
export type UserRole = 'ambassador' | 'college_admin' | 'hod' | 'faculty' | 'student' | 'judge' | 'sponsor' | 'dean_of_campus' | 'faculty_coordinator';

// User Interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  collegeId?: string;
  collegeName?: string;
  department?: string;
  departmentId?: string;
  departmentEntity?: Department;
  directorRole?: string;
  isClubHead?: boolean;
  year?: number; // Legacy field, map academicYear to this or use academicYear
  academicYear?: number;
  subRole?: string;
  points: number;
  streak: number;
  createdAt: Date;
  isEmailVerified: boolean;
}

export interface Department {
  id: string;
  name: string;
  collegeId: string;
  description?: string;
  hodId?: string;
}

// College Interface
export interface College {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  location: string;
  website?: string;
  description?: string;
  foundedYear?: number;
  studentCount: number;
  facultyCount: number;
  isActive: boolean;
  createdAt: Date;
  stats: CollegeStats;
}

export interface CollegeStats {
  totalEvents: number;
  totalHackathons: number;
  totalStudents: number;
  totalContent: number;
  engagementScore: number;
}

// Hackathon Interface
export interface Hackathon {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  bannerImage?: string;
  collegeId: string;
  collegeName: string;
  organizerId: string;
  organizerName: string;
  mode: 'online' | 'offline' | 'hybrid';
  location?: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  maxTeamSize: number;
  minTeamSize: number;
  prizePool: number;
  status: 'draft' | 'published' | 'registration_open' | 'ongoing' | 'completed' | 'cancelled' | 'HOD_APPROVAL_PENDING' | 'ACTIVE';
  tags: string[];
  techStack: string[];
  problemStatements: ProblemStatement[];
  sponsors: Sponsor[];
  faqs: FAQ[];
  rules: string[];
  judgingCriteria: JudgingCriterion[];
  registeredTeams: number;
  totalParticipants: number;
  isPublic: boolean;
  currency?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProblemStatement {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Sponsor {
  id: string;
  name: string;
  logo?: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  website?: string;
  description?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface JudgingCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  maxScore: number;
}

// Event Interface
export interface Event {
  id: string;
  title: string;
  description: string;
  bannerImage?: string;
  collegeId: string;
  collegeName: string;
  organizerId: string;
  organizerName: string;
  eventType: 'workshop' | 'seminar' | 'competition' | 'cultural' | 'sports' | 'tech_talk' | 'networking' | 'other';
  mode: 'online' | 'offline' | 'hybrid';
  location?: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline?: Date;
  capacity?: number;
  registeredCount: number;
  attendeesCount?: number;
  status: 'draft' | 'published' | 'registration_open' | 'ongoing' | 'completed' | 'cancelled' | 'HOD_APPROVAL_PENDING' | 'ACTIVE';
  tags: string[];
  requirements?: string;
  agenda?: AgendaItem[];
  speakers?: Speaker[];
  isPublic: boolean;
  requiresApproval: boolean;
  certificateTemplate?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgendaItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  speaker?: string;
}

export interface Speaker {
  id: string;
  name: string;
  designation: string;
  company?: string;
  avatar?: string;
  bio?: string;
}

// Team Interface
export interface Team {
  id: string;
  name: string;
  hackathonId: string;
  hackathonName: string;
  leaderId: string;
  leaderName: string;
  members: TeamMember[];
  projectName?: string;
  projectDescription?: string;
  githubUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  pptUrl?: string;
  submissionStatus: 'not_started' | 'in_progress' | 'submitted' | 'under_review' | 'evaluated';
  submittedAt?: Date;
  score?: number;
  rank?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'leader' | 'member';
  skills: string[];
  joinedAt: Date;
}

// Content/Resource Interface
export interface Content {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  thumbnailUrl?: string;
  collegeId: string;
  collegeName: string;
  uploaderId: string;
  uploaderName: string;
  department?: string;
  category: 'study_material' | 'lab_manual' | 'project_report' | 'research_paper' | 'club_document' | 'placement_prep' | 'other';
  tags: string[];
  accessLevel: 'public' | 'college_only' | 'department_only' | 'private';
  status: 'pending' | 'approved' | 'rejected';
  downloadCount: number;
  viewCount: number;
  version: number;
  previousVersions?: ContentVersion[];
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentVersion {
  version: number;
  fileUrl: string;
  uploadedAt: Date;
  uploadedBy: string;
}

// Notification Interface
export interface Notification {
  id: string;
  userId: string;
  type: 'event_reminder' | 'hackathon_update' | 'team_invite' | 'content_approved' | 'content_rejected' | 'registration_confirmed' | 'certificate_ready' | 'mention' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}

// Leaderboard Entry
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  collegeName: string;
  points: number;
  eventsAttended: number;
  hackathonsParticipated: number;
  certificatesEarned: number;
  streakDays: number;
}

// Analytics Interface
export interface Analytics {
  totalUsers: number;
  totalColleges: number;
  totalEvents: number;
  totalHackathons: number;
  totalContent: number;
  activeUsers: number;
  newUsersThisMonth: number;
  eventsThisMonth: number;
  hackathonsThisMonth: number;
  userGrowth: ChartData[];
  eventParticipation: ChartData[];
  hackathonStats: HackathonStats;
  topColleges: CollegeRanking[];
  topStudents: LeaderboardEntry[];
}

export interface ChartData {
  label: string;
  value: number;
  date?: Date;
}

export interface HackathonStats {
  total: number;
  ongoing: number;
  completed: number;
  averageParticipants: number;
  totalPrizePool: number;
}

export interface CollegeRanking {
  rank: number;
  collegeId: string;
  collegeName: string;
  score: number;
  eventsHosted: number;
  hackathonsHosted: number;
  studentParticipation: number;
}

// Certificate Interface
export interface Certificate {
  id: string;
  certificateId?: string;
  studentId?: string;
  studentName?: string;
  userName?: string;
  eventId?: string;
  eventTitle?: string;
  eventName?: string;
  hackathonId?: string;
  hackathonName?: string;
  type?: string;
  issueDate?: string | Date;
  position?: string;
  category?: string;
  role?: string;
  issuedAt?: string | Date;
  status?: 'ACTIVE' | 'REVOKED';
  userId?: string;
  qrCodeUrl?: string; // Optional if not yet generated
  pdfUrl?: string;
  certificateUrl?: string;
  certificateNumber?: string;
  verified?: boolean;
}

export interface ClubCertificate extends Certificate {
  clubId: string;
}

export interface ClubEventRegistration {
  id: string;
  studentId: string;
  studentName: string;
  attendanceStatus: 'REGISTERED' | 'ATTENDED' | 'ABSENT';
  completionStatus: 'COMPLETED' | 'INCOMPLETE';
  registeredAt: string;
  attendedAt?: string;
}

// Judge Evaluation
export interface Evaluation {
  id: string;
  hackathonId: string;
  teamId: string;
  teamName: string;
  judgeId: string;
  judgeName: string;
  scores: CriterionScore[];
  totalScore: number;
  feedback: string;
  evaluatedAt: Date;
}

export interface CriterionScore {
  criterionId: string;
  criterionName: string;
  score: number;
  maxScore: number;
  comment?: string;
}

// Search Filters
export interface HackathonFilters {
  search?: string;
  mode?: ('online' | 'offline' | 'hybrid')[];
  status?: string;
  techStack?: string[];
  prizeMin?: number;
  prizeMax?: number;
  startDateFrom?: Date;
  startDateTo?: Date;
  college?: string;
}

export interface EventFilters {
  search?: string;
  eventType?: string[];
  mode?: ('online' | 'offline' | 'hybrid')[];
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  college?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Theme Type
export interface Club {
  id: string;
  name: string;
  description: string;
  collegeId: string;
  collegeName: string;
  facultyAdvisorId?: string;
  facultyAdvisorName?: string;
  presidentId?: string;
  presidentName?: string;
  bannerUrl?: string;
  logoUrl?: string;
  category?: string;
  tags?: string;
  achievements?: string;
  isActive: boolean;
  recruitmentOpen?: boolean;
  createdAt: string;
}

export type TeamRole = 'ORGANIZER' | 'COORDINATOR' | 'VOLUNTEER' | 'JUDGE';

export interface EventTeamMember {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: TeamRole;
  assignedById?: string;
  assignedByName?: string;
  assignedAt: string;
}

export interface Webinar {
  id: string;
  title: string;
  description: string;
  speakerName: string;
  speakerBio: string;
  hostCollege: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  meetingLink?: string;
  startDate: string;
  endDate: string;
  duration: number;
  maxParticipants: number;
  registeredCount: number;
  bannerImage?: string;
  agenda?: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  createdBy: string;
  createdAt: string;
  isRegistered?: boolean;
}

export interface WebinarRegistration {
  id: string;
  webinarId: string;
  webinarTitle: string;
  speakerName: string;
  startDate: string;
  status: string;
  attendanceStatus: string;
  certificateGenerated: boolean;
  registeredAt: string;
}

export type Theme = 'light' | 'dark' | 'system';

// --- Club Management System Types ---

export type ClubEvent = Event;
export type ClubHackathon = Hackathon;

export interface ClubMember {
  id: string; // This is the ID of the membership record
  userId: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinedAt: string;
  contributionScore: number;
}

export interface ClubJoinRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  clubId: string;
  message: string;
  resumeUrl?: string;
  portfolioLink?: string;
  skills?: string;
  interviewScore?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface ClubPost {
  id: string;
  clubId: string;
  title: string;
  content: string;
  authorId: string;
  authorName?: string;
  likes: number;
  commentsCount: number;
  createdAt: string;
}

export interface ClubBudget {
  id: string;
  clubId: string;
  allocated: number;
  spent: number;
  revenue: number;
  fiscalYear: string;
  updatedAt: string;
}

export interface Ambassador {
  id: string;
  clubId: string;
  studentId: string;
  studentName: string;
  referrals: number;
  impactScore: number;
  status: 'ACTIVE' | 'INACTIVE';
  joinedAt: string;
}

export interface ClubHackathonTeam {
  id: string;
  hackathonId: string;
  teamName: string;
  leaderId: string;
  leaderName?: string;
  members: string[]; // List of names or IDs depending on usage
  projectTitle?: string;
  projectDescription?: string;
  submissionUrl?: string;
  totalScore: number;
  createdAt: string;
}

export interface HackathonScore {
  id: string;
  teamId: string;
  judgeId: string;
  innovation: number;
  technical: number;
  presentation: number;
  totalScore: number;
  feedback?: string;
}

export interface RecruitmentNotice {
  id: string;
  clubId: string;
  title: string;
  description: string;
  role: string;
  requirements: string;
  deadline: string;
  isOpen: boolean;
  createdAt: string;
}

