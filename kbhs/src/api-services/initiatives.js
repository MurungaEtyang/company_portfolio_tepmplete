import backGroundImage from "../assets/img/crystal-globe-with-stock-information.jpg"

export const initialData = {
    trustedCompanies: [
        { name: "Company 1", logo: "https://picsum.photos/200/300?random=4", link: "https://www.example.com", description: "This is a description of the company" },
        { name: "Company 2", logo: "https://picsum.photos/200/300?random=5", link: "https://www.example.com", description: "This is a description of the company" },
        { name: "Company 3", logo: "https://picsum.photos/200/300?random=6", link: "https://www.example.com", description: "This is a description of the company" },
        { name: "Company 4", logo: "https://picsum.photos/200/300?random=4", link: "https://www.example.com", description: "This is a description of the company" },
        { name: "Company 5", logo: "https://picsum.photos/200/300?random=5", link: "https://www.example.com", description: "This is a description of the company" },
        { name: "Company 6", logo: "https://picsum.photos/200/300?random=6", link: "https://www.example.com", description: "This is a description of the company" }
    ],
    dedicatedTeam: [
        { name: "Team Member 1", image: "https://picsum.photos/200/300?random=7" },
        { name: "Team Member 2", image: "https://picsum.photos/200/300?random=8" },
        { name: "Team Member 3", image: "https://picsum.photos/200/300?random=9" },
        { name: "Team Member 4", image: "https://picsum.photos/200/300?random=7" },
        { name: "Team Member 5", image: "https://picsum.photos/200/300?random=8" },
        { name: "Team Member 6", image: "https://picsum.photos/200/300?random=9" }
    ],
    dedicatedProjects: [
        { name: "Project 1", image: "https://picsum.photos/200/300?random=10" },
        { name: "Project 2", image: "https://picsum.photos/200/300?random=11" },
        { name: "Project 3", image: "https://picsum.photos/200/300?random=12" },
        { name: "Project 4", image: "https://picsum.photos/200/300?random=10" },
        { name: "Project 5", image: "https://picsum.photos/200/300?random=11" },
        { name: "Project 6", image: "https://picsum.photos/200/300?random=12" }
    ],

    displayButtons: [
        { name: "Industries", id: "trustedCompanies" },
        { name: "Team", id: "dedicatedTeam" },
        { name: "Projects", id: "dedicatedProjects" },
    ],
    titles: {
        trustedCompanies: "We have had the pleasure of working with companies from various industries.",
        dedicatedTeam: "Our team of skilled software developers is dedicated to delivering high-quality solutions.",
        dedicatedProjects: "Our dedicated projects showcase the innovative solutions we provide.",
        services: "Our Services"
    },

    background: backGroundImage
};