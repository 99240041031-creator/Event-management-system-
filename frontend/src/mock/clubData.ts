export const clubMockData = {
    stats: {
        assignedClubs: 3,
        totalMembers: 120,
        activeClubs: 2,
    },

    clubs: [
        {
            id: "1",
            name: "AI & ML Club",
            memberCount: 45,
            status: "ACTIVE",
            logo: "https://api.dicebear.com/7.x/shapes/svg?seed=ai-ml",
            category: "Technical",
            description: "Exploring the frontiers of Artificial Intelligence and Machine Learning through hands-on projects.",
            eventsCount: 12
        },
        {
            id: "2",
            name: "Web Development Club",
            memberCount: 60,
            status: "ACTIVE",
            logo: "https://api.dicebear.com/7.x/shapes/svg?seed=webdev",
            category: "Development",
            description: "Building the modern web with React, Node.js, and cutting-edge cloud technologies.",
            eventsCount: 24
        },
        {
            id: "3",
            name: "Cyber Security Club",
            memberCount: 15,
            status: "INACTIVE",
            logo: "https://api.dicebear.com/7.x/shapes/svg?seed=cyber",
            category: "Security",
            description: "Hardening systems and learning defensive security protocols and ethical hacking.",
            eventsCount: 4
        }
    ]
};
