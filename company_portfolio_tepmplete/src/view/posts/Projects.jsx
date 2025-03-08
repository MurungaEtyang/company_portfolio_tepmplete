import React, { useState, useEffect } from "react";
import { get_projects } from "../../services/projects/projects";

const Projects = () => {
    const [activeTab, setActiveTab] = useState(null);
    const [projects, setProjects] = useState([]);
    const [projectStatuses, setProjectStatuses] = useState([]);
    const [expandedProject, setExpandedProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            const data = await get_projects();
            const filteredProjects = data.data.filter((project) => project.status === activeTab);
            setProjects(filteredProjects);
            setProjectStatuses([...new Set(data.data.map((project) => project.status))]);
            setLoading(false);
        };
        fetchProjects();
    }, [activeTab]);

    useEffect(() => {
        if (projectStatuses.length > 0 && !activeTab) {
            setActiveTab(projectStatuses[0]);
        }
    }, [projectStatuses, activeTab]);

    const toggleExpand = (project) => {
        setExpandedProject(expandedProject === project.id ? null : project.id);
    };

    return (
        <div className="min-h-screen  py-10">
            <div className="max-w-6xl mx-auto px-6">
                <nav className="flex justify-between items-center py-4">
                    <h2 className="text-3xl font-bold text-green-600">Government Projects</h2>
                    <ul className="flex items-center space-x-4">
                        {projectStatuses.map((status) => (
                            <li key={status}>
                                <button
                                    onClick={() => {
                                        setActiveTab(status);
                                        setExpandedProject(null);
                                    }}
                                    className={`text-gray-600 hover:text-green-600 ${activeTab === status ? "text-green-600 font-bold" : ""}`}
                                >
                                    {status}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="loader" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {projects.map((project) => (
                            <div key={project.id} className="border border-gray-300 bg-white p-6 rounded-lg shadow-md">
                                <h3
                                    className="text-xl font-semibold text-gray-800 cursor-pointer hover:text-blue-500"
                                    onClick={() => toggleExpand(project)}
                                >
                                    {project.title}
                                </h3>

                                {expandedProject === project.id && (
                                    <div className="mt-4 text-gray-700" id={`general-css`}>
                                        <div className="prose prose-lg max-w-none bg-gray-100 p-6 rounded-lg shadow-md">
                                            <div className="[&_*]:max-w-full [&_*]:w-full [&_img]:h-[500px] [&_video]:h-[500px]"
                                                 dangerouslySetInnerHTML={{__html: project.description}}/>
                                        </div>


                                        <p className={`mt-2 text-sm font-medium ${project.status === "in-progress" ? "text-blue-500" : project.status === "publish" ? "text-green-600" : "text-yellow-500"}`}>
                                            Status: {project.status}
                                        </p>
                                        <p className="text-gray-500">
                                            Expected Completion: {new Date(project.deadline).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Projects;