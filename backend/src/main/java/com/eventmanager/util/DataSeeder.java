package com.eventmanager.util;

import com.eventmanager.model.*;
import com.eventmanager.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.Arrays;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CollegeRepository collegeRepository;
    private final UserRepository userRepository;
    private final HackathonRepository hackathonRepository;
    private final EventRepository eventRepository;
    private final ClubRepository clubRepository;
    private final ForumPostRepository postRepository;
    private final ForumCommentRepository commentRepository;
    private final ProblemStatementRepository problemStatementRepository;

    public DataSeeder(CollegeRepository collegeRepository, UserRepository userRepository,
            HackathonRepository hackathonRepository, EventRepository eventRepository,
            ClubRepository clubRepository, ForumPostRepository postRepository,
            ForumCommentRepository commentRepository, ProblemStatementRepository problemStatementRepository) {
        this.collegeRepository = collegeRepository;
        this.userRepository = userRepository;
        this.hackathonRepository = hackathonRepository;
        this.eventRepository = eventRepository;
        this.clubRepository = clubRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.problemStatementRepository = problemStatementRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        College c1;
        College c2;

        if (collegeRepository.count() == 0) {
            // Seed Colleges
            c1 = new College();
            c1.setName("Tech University");
            c1.setShortName("TU");
            c1.setLocation("San Francisco, CA");
            c1.setDescription("Leading technology university focused on innovation and research.");
            c1.setStudentCount(15000);
            c1.setIsActive(true);
            collegeRepository.save(c1);

            c2 = new College();
            c2.setName("State College of Engineering");
            c2.setShortName("SCE");
            c2.setLocation("Austin, TX");
            collegeRepository.save(c2);
        } else {
            c1 = collegeRepository.findByShortName("TU").orElseThrow();
            c2 = collegeRepository.findByShortName("SCE").orElseThrow();
        }

        User student;
        User faculty;
        User admin;

        if (userRepository.count() == 0) {
            // Seed Users matching Frontend Demo Accounts

            // 1. Student
            student = new User();
            student.setName("Alex Johnson");
            student.setEmail("student@college.edu");
            student.setPassword(new BCryptPasswordEncoder().encode("password"));
            student.setRole("student");
            student.setCollege(c1);
            student.setPoints(1250);
            student.setStreak(21);
            student.setAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Alex");
            userRepository.save(student);

            // 2. Faculty
            faculty = new User();
            faculty.setName("Dr. Sarah Chen");
            faculty.setEmail("faculty@college.edu");
            faculty.setPassword(new BCryptPasswordEncoder().encode("password"));
            faculty.setRole("faculty");
            faculty.setCollege(c1);
            faculty.setPoints(500);
            faculty.setStreak(5);
            faculty.setAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah");
            userRepository.save(faculty);

            // 3. College Admin
            admin = new User();
            admin.setName("Michael Roberts");
            admin.setEmail("admin@college.edu");
            admin.setPassword(new BCryptPasswordEncoder().encode("password"));
            admin.setRole("college_admin");
            admin.setCollege(c1);
            admin.setPoints(1000);
            admin.setStreak(10);
            admin.setAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Michael");
            userRepository.save(admin);

            // 4. Super Admin
            User superAdmin = new User();
            superAdmin.setName("Emma Wilson");
            superAdmin.setEmail("super@platform.com");
            superAdmin.setPassword(new BCryptPasswordEncoder().encode("password"));
            superAdmin.setRole("super_admin");
            superAdmin.setPoints(2000);
            superAdmin.setStreak(30);
            superAdmin.setAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Emma");
            userRepository.save(superAdmin);

            // 5. Judge
            User judge = new User();
            judge.setName("David Park");
            judge.setEmail("judge@hackathon.com");
            judge.setPassword(new BCryptPasswordEncoder().encode("password"));
            judge.setRole("judge");
            judge.setPoints(800);
            judge.setStreak(15);
            judge.setAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=David");
            userRepository.save(judge);

        } else {
            student = userRepository.findByEmail("student@college.edu").orElse(null);
            faculty = userRepository.findByEmail("faculty@college.edu").orElse(null);
            admin = userRepository.findByEmail("admin@college.edu").orElse(null);

            // Fallback if records exist but emails don't match (shouldn't happen with count check)
            if (student == null) {
                student = userRepository.findAll().stream()
                    .filter(u -> "student".equals(u.getRole())).findFirst().orElse(null);
            }
        }
        
        if (userRepository.findByEmail("director@college.edu").isEmpty()) {
            // 6. Director GOPI
            User director = new User();
            director.setName("GOPI g");
            director.setEmail("director@college.edu");
            director.setPassword(new BCryptPasswordEncoder().encode("password"));
            director.setRole("director");
            director.setSubRole("director");
            director.setCollege(c1);
            director.setPoints(3000);
            director.setStreak(50);
            director.setAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Director");
            userRepository.save(director);
        }

        if (hackathonRepository.count() == 0) {
            // 1. AI Innovation Challenge
            Hackathon h1 = new Hackathon();
            h1.setTitle("Neural Nexus: AI Agents 2024");
            h1.setShortDescription("Build the next generation of autonomous AI agents.");
            h1.setDescription("A premier 48-hour challenge focused on Generative AI, Large Language Models, and Autonomous Systems. Developers will have access to exclusive GPU clusters and mentoring from OpenAI and Google researchers.");
            h1.setCollege(c1);
            h1.setOrganizer(admin);
            h1.setMode("hybrid");
            h1.setLocation("Tech Arena, Block A");
            h1.setCountry("USA");
            h1.setTags(Arrays.asList("AI", "ML", "Python", "LLMs", "Pytorch"));
            h1.setMaxSpots(500);
            h1.setRegisteredCount(442);
            h1.setRules("1. Team size: 2-4 members. 2. Original code only written during the event. 3. Final submissions must include a demo video and GitHub repository. 4. Respect all participants.");
            h1.setSponsors("[{\"name\":\"Google Cloud\",\"logo\":\"https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg\"},{\"name\":\"OpenAI\",\"logo\":\"https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg\"},{\"name\":\"NVIDIA\",\"logo\":\"https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg\"}]");
            h1.setFaqs("[{\"q\":\"Can I participate solo?\",\"a\":\"No, minimum team size is 2 to encourage collaboration.\"},{\"q\":\"Is it free?\",\"a\":\"Yes, registration is free for verified students.\"},{\"q\":\"Do we get hardware?\",\"a\":\"Cloud GPU credits will be provided to all finalists.\"}]");
            h1.setJudges("[{\"name\":\"Andrew Ng\",\"role\":\"Founder, DeepLearning.AI\"},{\"name\":\"Sam Altman\",\"role\":\"CEO, OpenAI\"},{\"name\":\"Fei-Fei Li\",\"role\":\"Stanford Professor\"}]");
            h1.setStartDate(LocalDate.now().plusDays(5));
            h1.setEndDate(LocalDate.now().plusDays(7));
            h1.setRegistrationDeadline(LocalDate.now().plusDays(4));
            h1.setMinTeamSize(2);
            h1.setMaxTeamSize(4);
            h1.setPrizePool("25000");
            h1.setCurrency("USD");
            h1.setStatus("registration_open");
            h1.setBannerImage("https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80");
            h1 = hackathonRepository.save(h1);

            // 2. Cyber Security Challenge
            Hackathon h2 = new Hackathon();
            h2.setTitle("Titan Shield: National Cyber Battle");
            h2.setShortDescription("Elite CTF and defensive security challenge.");
            h2.setDescription("A high-stakes cybersecurity competition involving penetration testing, digital forensics, and hardware security audits. Compete against the best minds in the country for a spot in the national defense unit.");
            h2.setCollege(c1);
            h2.setOrganizer(admin);
            h2.setMode("offline");
            h2.setLocation("Main Hall, Stanford");
            h2.setCountry("USA");
            h2.setTags(Arrays.asList("Security", "Linux", "Network", "CTF", "Forensics"));
            h2.setMaxSpots(200);
            h2.setRegisteredCount(188);
            h2.setRules("1. No external assistance during live rounds. 2. Flag sharing is grounds for immediate disqualification. 3. All participants must follow the code of ethics.");
            h2.setSponsors("[{\"name\":\"CrowdStrike\",\"logo\":\"https://upload.wikimedia.org/wikipedia/commons/b/b3/CrowdStrike_logo.svg\"},{\"name\":\"Cisco\",\"logo\":\"https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg\"}]");
            h2.setJudges("[{\"name\":\"Kevin Mitnick\",\"role\":\"Security Expert\"},{\"name\":\"Parag Agrawal\",\"role\":\"Former CEO, Twitter\"}]");
            h2.setStartDate(LocalDate.now().plusDays(15));
            h2.setEndDate(LocalDate.now().plusDays(17));
            h2.setRegistrationDeadline(LocalDate.now().plusDays(12));
            h2.setMinTeamSize(1);
            h2.setMaxTeamSize(3);
            h2.setPrizePool("15000");
            h2.setCurrency("USD");
            h2.setStatus("upcoming");
            h2.setBannerImage("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80");
            h2 = hackathonRepository.save(h2);

            // 3. Eco-Tech Innovation Sprint
            Hackathon h3 = new Hackathon();
            h3.setTitle("Green Horizon: Eco-Tech Sprint");
            h3.setShortDescription("Tech solutions for a sustainable future.");
            h3.setDescription("Solve pressing environmental issues through technology. Focus areas include carbon credits, renewable grid management, and sustainable supply chains.");
            h3.setCollege(c2);
            h3.setOrganizer(faculty);
            h3.setMode("online");
            h3.setCountry("UK");
            h3.setTags(Arrays.asList("Eco", "IoT", "CleanEnergy", "Sustainability", "Azure"));
            h3.setMaxSpots(1000);
            h3.setRegisteredCount(750);
            h3.setRules("1. Focus on sustainability. 2. Projects must be open source. 3. Maximum 5 members per team.");
            h3.setSponsors("[{\"name\":\"Tesla\",\"logo\":\"https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png\"},{\"name\":\"Schneider Electric\",\"logo\":\"https://upload.wikimedia.org/wikipedia/commons/9/95/Schneider_Electric_logo.svg\"}]");
            h3.setStartDate(LocalDate.now().plusDays(25));
            h3.setEndDate(LocalDate.now().plusDays(27));
            h3.setRegistrationDeadline(LocalDate.now().plusDays(20));
            h3.setMinTeamSize(3);
            h3.setMaxTeamSize(5);
            h3.setPrizePool("10000");
            h3.setCurrency("USD");
            h3.setStatus("upcoming");
            h3.setBannerImage("https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80");
            h3 = hackathonRepository.save(h3);

            // 4. FinTech Revolution
            Hackathon h4 = new Hackathon();
            h4.setTitle("DeFi Frontier: FinTech 2.0");
            h4.setShortDescription("Disrupting banking with decentralized protocols.");
            h4.setDescription("Develop decentralized finance apps, automated market makers, and cross-chain bridges. We are looking for the next Uniswap or Aave.");
            h4.setCollege(c1);
            h4.setOrganizer(admin);
            h4.setMode("online");
            h4.setCountry("Germany");
            h4.setTags(Arrays.asList("Finance", "Web3", "Blockchain", "Solidity", "Defi"));
            h4.setMaxSpots(1500);
            h4.setRegisteredCount(1420);
            h4.setRules("1. Smart contracts must be verified on Etherscan/Solscan. 2. Original UI/UX. 3. 24/7 support via Discord.");
            h4.setSponsors("[{\"name\":\"Binance\",\"logo\":\"https://upload.wikimedia.org/wikipedia/commons/5/57/Binance_Logo.svg\"},{\"name\":\"Coinbase\",\"logo\":\"https://upload.wikimedia.org/wikipedia/commons/c/c2/Coinbase_Logo.svg\"}]");
            h4.setStartDate(LocalDate.now().minusDays(2));
            h4.setEndDate(LocalDate.now().plusDays(1));
            h4.setRegistrationDeadline(LocalDate.now().minusDays(5));
            h4.setMinTeamSize(2);
            h4.setMaxTeamSize(4);
            h4.setPrizePool("50000");
            h4.setCurrency("USD");
            h4.setStatus("ongoing");
            h4.setBannerImage("https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80");
            h4 = hackathonRepository.save(h4);

            // 5. GameDev Arena
            Hackathon h5 = new Hackathon();
            h5.setTitle("Infinite Worlds: GameDev Arena");
            h5.setShortDescription("Build the next indie hit in 48 hours.");
            h5.setDescription("Unity, Unreal, or Custom engines – create immersive experiences that push the boundaries of storytelling and gameplay.");
            h5.setCollege(c2);
            h5.setOrganizer(faculty);
            h5.setMode("hybrid");
            h5.setLocation("Virtual & Lab 404");
            h5.setCountry("Canada");
            h5.setTags(Arrays.asList("Gaming", "Unity", "C#", "Unreal", "Blender"));
            h5.setMaxSpots(300);
            h5.setRegisteredCount(250);
            h5.setSponsors("[{\"name\":\"Epic Games\",\"logo\":\"https://upload.wikimedia.org/wikipedia/commons/3/31/Epic_Games_logo.svg\"},{\"name\":\"Unity\",\"logo\":\"https://upload.wikimedia.org/wikipedia/commons/1/19/Unity_Technologies_logo.svg\"}]");
            h5.setStartDate(LocalDate.now().plusDays(40));
            h5.setEndDate(LocalDate.now().plusDays(42));
            h5.setRegistrationDeadline(LocalDate.now().plusDays(35));
            h5.setMinTeamSize(1);
            h5.setMaxTeamSize(5);
            h5.setPrizePool("12000");
            h5.setCurrency("USD");
            h5.setStatus("upcoming");
            h5.setBannerImage("https://images.unsplash.com/photo-1552824734-14b2d56d47b5?auto=format&fit=crop&q=80");
            h5 = hackathonRepository.save(h5);

            // 6. HealthTech Connect
            Hackathon h6 = new Hackathon();
            h6.setTitle("VitalLink: HealthTech Connect");
            h6.setShortDescription("Modern digital solutions for proactive healthcare.");
            h6.setDescription("Focus on wearable tech, remote patient monitoring, and AI-driven diagnosis. Partnered with top hospitals.");
            h6.setCollege(c1);
            h6.setOrganizer(admin);
            h6.setMode("offline");
            h6.setLocation("Medical Center Hall");
            h6.setCountry("India");
            h6.setTags(Arrays.asList("Health", "Wearables", "IoT", "SaaS", "Flutter"));
            h6.setMaxSpots(100);
            h6.setRegisteredCount(100);
            h6.setRules("1. Healthcare privacy (HIPAA-like) compliance. 2. Real data usage encouraged. 3. Mentorship from doctors available.");
            h6.setSponsors("[{\"name\":\"Apollo Hospitals\",\"logo\":\"https://upload.wikimedia.org/wikipedia/en/2/2a/Apollo_Hospitals_Logo.svg\"}]");
            h6.setStartDate(LocalDate.now().minusDays(20));
            h6.setEndDate(LocalDate.now().minusDays(18));
            h6.setRegistrationDeadline(LocalDate.now().minusDays(25));
            h6.setMinTeamSize(2);
            h6.setMaxTeamSize(4);
            h6.setPrizePool("20000");
            h6.setCurrency("USD");
            h6.setStatus("completed");
            h6.setResultsPublished(true);
            h6.setBannerImage("https://images.unsplash.com/photo-1576091160550-2173dad99968?auto=format&fit=crop&q=80");
            h6 = hackathonRepository.save(h6);

            // 7. Space Frontier Hack
            Hackathon h7 = new Hackathon();
            h7.setTitle("Orion: Space Frontier Hack");
            h7.setShortDescription("Mapping the cosmos with data science.");
            h7.setDescription("Using NASA and ESA open datasets to solve global navigation, climate tracking, and deep space exploration challenges.");
            h7.setCollege(c1);
            h7.setOrganizer(admin);
            h7.setMode("online");
            h7.setCountry("Japan");
            h7.setTags(Arrays.asList("Space", "DataScience", "NASA", "Satellite", "Python"));
            h7.setMaxSpots(800);
            h7.setRegisteredCount(650);
            h7.setSponsors("[{\"name\":\"JAXA\",\"logo\":\"https://upload.wikimedia.org/wikipedia/commons/8/85/Jaxa_logo.svg\"}]");
            h7.setStartDate(LocalDate.now().plusDays(60));
            h7.setEndDate(LocalDate.now().plusDays(62));
            h7.setRegistrationDeadline(LocalDate.now().plusDays(55));
            h7.setMinTeamSize(2);
            h7.setMaxTeamSize(6);
            h7.setPrizePool("30000");
            h7.setCurrency("USD");
            h7.setStatus("upcoming");
            h7.setBannerImage("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80");
            h7 = hackathonRepository.save(h7);

            // 8. Global Web3 Summit
            Hackathon h8 = new Hackathon();
            h8.setTitle("Genesis: Global Web3 Summit");
            h8.setShortDescription("Building the decentralized internet.");
            h8.setDescription("Deep dive into Layer 2 solutions, Zero-Knowledge Proofs, and Decentralized Identity. One of the largest Web3 events in Europe.");
            h8.setCollege(c1);
            h8.setOrganizer(admin);
            h8.setMode("hybrid");
            h8.setLocation("Innovation Center");
            h8.setCountry("Switzerland");
            h8.setTags(Arrays.asList("Web3", "Solana", "Ethereum", "DAOs", "ZK-Proofs"));
            h8.setMaxSpots(100);
            h8.setRegisteredCount(85);
            h8.setRules("1. No fork of existing projects. 2. Must submit a whitepaper snippet. 3. Active GitHub history required.");
            h8.setSponsors("[{\"name\":\"Polygon\",\"logo\":\"https://upload.wikimedia.org/wikipedia/commons/8/8c/Polygon_blockchain_logo.svg\"},{\"name\":\"Chainlink\",\"logo\":\"https://upload.wikimedia.org/wikipedia/commons/5/5e/Chainlink_Logo.svg\"}]");
            h8.setStartDate(LocalDate.now().plusDays(5));
            h8.setEndDate(LocalDate.now().plusDays(6));
            h8.setRegistrationDeadline(LocalDate.now().plusDays(4));
            h8.setMinTeamSize(2);
            h8.setMaxTeamSize(4);
            h8.setPrizePool("40000");
            h8.setCurrency("USD");
            h8.setStatus("registration_open");
            h8.setBannerImage("https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80");
            h8 = hackathonRepository.save(h8);

            // Seed Problem Statements for Neural Nexus
            ProblemStatement ps1 = new ProblemStatement();
            ps1.setTitle("Edge-AI for Real-time Translation");
            ps1.setDescription("Build a low-latency system that converts sign language to speech on edge devices with limited compute.");
            ps1.setCategory("Computer Vision");
            ps1.setDifficulty("hard");
            ps1.setHackathon(h1);
            problemStatementRepository.save(ps1);

            ProblemStatement ps2 = new ProblemStatement();
            ps2.setTitle("Autonomous DeFi Risk Guard");
            ps2.setDescription("Create an AI agent that monitors smart contract transactions for flash-loan attack patterns in real-time.");
            ps2.setCategory("FinTech/AI");
            ps2.setDifficulty("medium");
            ps2.setHackathon(h1);
            problemStatementRepository.save(ps2);

            ProblemStatement ps3 = new ProblemStatement();
            ps3.setTitle("Swarm Intelligence for Disaster Relief");
            ps3.setDescription("Optimize the coordination of drone swarms for search and rescue operations using collective intelligence models.");
            ps3.setCategory("Robotics");
            ps3.setDifficulty("hard");
            ps3.setHackathon(h1);
            problemStatementRepository.save(ps3);

        }

        if (eventRepository.count() == 0) {
            // Seed Events
            Event e1 = new Event();
            e1.setTitle("Tech Talk: AI Ethics");
            e1.setDescription("Discussion on AI Ethics.");
            e1.setCollege(c1);
            e1.setOrganizer(admin);
            e1.setStartDate(LocalDateTime.now().plusDays(5));
            e1.setEndDate(LocalDateTime.now().plusDays(5).plusHours(2));
            e1.setEventType("tech_talk");
            e1.setStatus("registration_open");
            eventRepository.save(e1);
        }

        // Seed Forum Posts and Comments
        if (postRepository.count() == 0) {
            ForumPost p1 = new ForumPost();
            p1.setTitle("Best resources for learning React?");
            p1.setContent("I'm starting with React and looking for good tutorials or courses. Any recommendations?");
            p1.setCategory("Technology");
            p1.setAuthor(student);
            p1.setUpvotes(15);
            p1.setCreatedAt(LocalDateTime.now().minusDays(2));
            ForumPost savedP1 = postRepository.save(p1);

            ForumComment c1_comment = new ForumComment();
            c1_comment.setPost(savedP1);
            c1_comment.setAuthor(faculty);
            c1_comment.setContent("Check out the official documentation, it's very comprehensive.");
            c1_comment.setCreatedAt(LocalDateTime.now().minusDays(1));
            commentRepository.save(c1_comment);

            ForumPost p2 = new ForumPost();
            p2.setTitle("Hackathon Team Building");
            p2.setContent("Looking for teammates for the upcoming AI Hackathon. I'm good with Python and ML.");
            p2.setCategory("Hackathons");
            p2.setAuthor(student);
            p2.setUpvotes(8);
            p2.setCreatedAt(LocalDateTime.now().minusHours(5));
            postRepository.save(p2);
            
            System.out.println("Seeded Forum Posts and Comments");
        }
        if (clubRepository.count() == 0) {
            Club club1 = new Club();
            club1.setName("AI & Machine Learning Club");
            club1.setDescription("Explore the fascinating world of Artificial Intelligence and Machine Learning. Join us for workshops, hackathons, and research projects in cutting-edge AI technologies.");
            club1.setCollege(c1);
            club1.setFacultyAdvisor(faculty);
            club1.setPresident(student);
            club1.setCategory("Technology");
            club1.setTags("AI,ML,Deep Learning,Neural Networks");
            club1.setBannerUrl("https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800");
            club1.setLogoUrl("https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200");
            club1.setActive(true);
            club1.setAchievements("Winner of National AI Hackathon 2023, Published 5 research papers");
            clubRepository.save(club1);

            Club club2 = new Club();
            club2.setName("Robotics & Automation Society");
            club2.setDescription("Build, program, and compete with robots! From basic Arduino projects to advanced autonomous systems, we cover it all.");
            club2.setCollege(c1);
            club2.setFacultyAdvisor(faculty);
            club2.setPresident(student);
            club2.setCategory("Engineering");
            club2.setTags("Robotics,Automation,Arduino,ROS");
            club2.setBannerUrl("https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800");
            club2.setLogoUrl("https://images.unsplash.com/photo-1563207153-f403bf289096?w=200");
            club2.setActive(true);
            club2.setAchievements("1st Place in RoboCup 2023, 3 International Competitions");
            clubRepository.save(club2);

            Club club3 = new Club();
            club3.setName("Web Development Guild");
            club3.setDescription("Master modern web technologies including React, Node.js, and cloud deployment. Build real-world projects and contribute to open source.");
            club3.setCollege(c1);
            club3.setFacultyAdvisor(faculty);
            club3.setPresident(student);
            club3.setCategory("Technology");
            club3.setTags("Web Dev,React,Node.js,Full Stack");
            club3.setBannerUrl("https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800");
            club3.setLogoUrl("https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=200");
            club3.setActive(true);
            club3.setAchievements("Developed 10+ production apps, 50+ open source contributions");
            clubRepository.save(club3);

            Club club4 = new Club();
            club4.setName("Cybersecurity Alliance");
            club4.setDescription("Learn ethical hacking, network security, and cryptography. Participate in CTF competitions and security audits.");
            club4.setCollege(c1);
            club4.setFacultyAdvisor(faculty);
            club4.setPresident(student);
            club4.setCategory("Security");
            club4.setTags("Cybersecurity,Ethical Hacking,CTF,Cryptography");
            club4.setBannerUrl("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800");
            club4.setLogoUrl("https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=200");
            club4.setActive(true);
            club4.setAchievements("Top 10 in National CTF Championship, 25+ security audits completed");
            clubRepository.save(club4);

            Club club5 = new Club();
            club5.setName("Data Science & Analytics Club");
            club5.setDescription("Dive into data analysis, visualization, and predictive modeling. Work with real datasets and industry partners.");
            club5.setCollege(c1);
            club5.setFacultyAdvisor(faculty);
            club5.setPresident(student);
            club5.setCategory("Data Science");
            club5.setTags("Data Science,Analytics,Python,R,Tableau");
            club5.setBannerUrl("https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800");
            club5.setLogoUrl("https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=200");
            club5.setActive(true);
            club5.setAchievements("Partnered with 5 companies, 15+ data projects completed");
            clubRepository.save(club5);

            Club club6 = new Club();
            club6.setName("Mobile App Developers");
            club6.setDescription("Create amazing mobile experiences for iOS and Android. Learn Flutter, React Native, and native development.");
            club6.setCollege(c2);
            club6.setFacultyAdvisor(faculty);
            club6.setPresident(student);
            club6.setCategory("Technology");
            club6.setTags("Mobile Dev,Flutter,React Native,iOS,Android");
            club6.setBannerUrl("https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800");
            club6.setLogoUrl("https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=200");
            club6.setActive(true);
            club6.setAchievements("20+ apps published, 100K+ downloads");
            clubRepository.save(club6);

            Club club7 = new Club();
            club7.setName("Cloud Computing Enthusiasts");
            club7.setDescription("Master AWS, Azure, and GCP. Learn DevOps, containerization, and serverless architectures.");
            club7.setCollege(c1);
            club7.setFacultyAdvisor(faculty);
            club7.setPresident(student);
            club7.setCategory("Cloud");
            club7.setTags("Cloud,AWS,Azure,DevOps,Kubernetes");
            club7.setBannerUrl("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800");
            club7.setLogoUrl("https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200");
            club7.setActive(true);
            club7.setAchievements("AWS Certified members: 15, 3 cloud migration projects");
            clubRepository.save(club7);

            Club club8 = new Club();
            club8.setName("Blockchain & Crypto Society");
            club8.setDescription("Explore blockchain technology, smart contracts, and decentralized applications. Build the future of Web3.");
            club8.setCollege(c1);
            club8.setFacultyAdvisor(faculty);
            club8.setPresident(student);
            club8.setCategory("Blockchain");
            club8.setTags("Blockchain,Crypto,Web3,Smart Contracts,DeFi");
            club8.setBannerUrl("https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800");
            club8.setLogoUrl("https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=200");
            club8.setActive(true);
            club8.setAchievements("Developed 5 DApps, 2 blockchain research papers");
            clubRepository.save(club8);

            System.out.println("Database seeded successfully with demo accounts and clubs!");
        }
    }
}
