import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createProject, updateProject, updateProjectStatus } from "../admin-service/project";

const CreateProject = () => {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [visibility, setVisibility] = useState("draft");
    const [status, setStatus] = useState("in-progress");
    const [projectId, setProjectId] = useState(null);
    const [postMessages, setPostMessages] = useState("");

    useEffect(() => {
        const storedId = localStorage.getItem("projectId");
        if (storedId) {
            setProjectId(storedId);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const projectData = {
            title,
            amount: parseFloat(amount),
            description,
            deadline,
            visibility
        };

        createProject(projectData.title, projectData.amount, projectData.description, projectData.deadline, projectData.visibility)
            .then((data) => {
                const { postMessage, id } = data;
                localStorage.setItem("projectId", id);
                setProjectId(id);
                setPostMessages(postMessage);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleVisibilityChange = (e) => {
        const newVisibility = e.target.value;
        setVisibility(newVisibility);

        if (projectId) {
            updateProject(newVisibility, projectId)
                .then((data) => {
                    alert(data.postMessage);
                    localStorage.removeItem("projectId");
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            alert("No project found. Please create one first.");
        }
    };

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);

        if (projectId) {
            updateProjectStatus(newStatus, projectId)
                .then((data) => {
                    alert(data.postMessage);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            alert("No project found. Please create one first.");
        }
    };

    return (
        <div className="relative">
            <h2 className="text-3xl font-bold mb-6 text-green-400">Create New Project</h2>
            <form onSubmit={handleSubmit} className="space-y-6">

                <div className="flex items-center justify-end">
                    <label htmlFor="project-visibility" className="block text-lg font-medium mr-4">Visibility</label>
                    <select
                        id="project-visibility"
                        value={visibility}
                        onChange={handleVisibilityChange}
                        className="bg-gray-800 text-white rounded-md border border-gray-600 p-2"
                    >
                        <option value="draft" className="text-gray-400">Draft</option>
                        <option value="published" className="text-green-400">Published</option>
                    </select>
                </div>

                {/* Status Dropdown */}
                <div className="flex items-center justify-end">
                    <label htmlFor="project-status" className="block text-lg font-medium mr-4">Status</label>
                    <select
                        id="project-status"
                        value={status}
                        onChange={handleStatusChange}
                        className="bg-gray-800 text-white rounded-md border border-gray-600 p-2"
                    >
                        <option value="in-progress" className="text-gray-400">In Progress</option>
                        <option value="completed" className="text-green-400">Completed</option>
                        <option value="draft" className="text-gray-400">Draft</option>
                        <option value="planned" className="text-green-400">Planned</option>
                    </select>
                </div>

                <div>
                    <label className="block text-lg font-medium">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-600"
                        placeholder="Enter project title"
                        required
                    />
                </div>

                {/* Amount Input */}
                <div>
                    <label className="block text-lg font-medium">Amount (KSH)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-600"
                        placeholder="Enter project budget"
                        required
                    />
                </div>

                {/* Deadline Input */}
                <div>
                    <label className="block text-lg font-medium">Deadline</label>
                    <input
                        type="datetime-local"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-600"
                        required
                    />
                </div>

                <p className="text-green-500 text-sm mb-2">{postMessages}</p>

                <div className="relative h-96">
                    <label className="block text-lg font-medium">Description</label>
                    <ReactQuill
                        theme="snow"
                        value={description}
                        onChange={setDescription}
                        modules={{
                            toolbar: [
                                [{header: [1, 2, 3, 4, 5, 6, false]}],
                                ["bold", "italic", "underline", "strike", "blockquote"],
                                [{list: "ordered"}, {list: "bullet"}, {indent: "-1"}, {indent: "+1"}],
                                [{script: "sub"}, {script: "super"}],
                                [{align: []}],
                                ["link", "image", "video"],
                                ["code-block"],
                            ],
                        }}
                        formats={[
                            "header",
                            "bold", "italic", "underline", "strike", "blockquote",
                            "list", "bullet", "indent",
                            "script", "align",
                            "link", "image", "video",
                            "code-block",
                        ]}
                        className="bg-white text-black rounded-md h-full text-lg z-0"
                    />
                </div>


                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-500 text-white p-3 rounded-md font-semibold relative z-10"
                >
                    Save
                </button>
            </form>
        </div>
    );
};

export default CreateProject;
