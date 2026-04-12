export const facultyDashboardMock = {
    stats: {
        myHackathonsCount: 3,
        myEventsCount: 2,
        activeRegistrationsCount: 128,
        certificatesIssuedCount: 56,
        eventRegistrationGrowth: 75,
        contentDownloadGrowth: 45,
        hackathonTeamGrowth: 60
    },

    recentActivity: [
        { message: "New registration for AI Innovation", timestamp: new Date().toISOString() },
        { message: "Certificate issued to Rohan Gupta", timestamp: new Date(Date.now() - 86400000).toISOString() },
        { message: "Hackathon project submitted: Smart City", timestamp: new Date(Date.now() - 172800000).toISOString() }
    ],

    hackathons: [
        {
            id: "1",
            title: "AI Innovation Challenge",
            registeredCount: 45,
            maxSpots: 100,
            status: "UPCOMING",
            bannerImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: "2",
            title: "Web3 Builders Hack",
            registeredCount: 60,
            maxSpots: 80,
            status: "ONGOING",
            bannerImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: "3",
            title: "Smart India Hackathon",
            registeredCount: 23,
            maxSpots: 50,
            status: "COMPLETED",
            bannerImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"
        }
    ],

    events: [
        {
            id: "e1",
            title: "React Workshop",
            registeredCount: 15,
            eventType: "WORKSHOP",
            status: "UPCOMING",
            startDate: new Date(Date.now() + 86400000 * 2).toISOString()
        },
        {
            id: "e2",
            title: "Cloud Career Talk",
            registeredCount: 89,
            eventType: "SEMINAR",
            status: "ONGOING",
            startDate: new Date().toISOString()
        }
    ]
};
