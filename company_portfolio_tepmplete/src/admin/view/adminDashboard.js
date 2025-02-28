import { useState } from "react";
import AdminLogin from "./AdminLogin";
import { adminLogout } from "../admin-service/AdminLogOut";
import CreateProject from "./CreatePrtoject";
import Socials from "./socials/twitter/Socials";

const AdminDashboard = () => {

    const name = localStorage.getItem("last_name");
    const email = localStorage.getItem("admin_email");
    const token = localStorage.getItem("admin_token");
    const [activeSection, setActiveSection] = useState(token ? "dashboard" : null);
    const role = localStorage.getItem('role');

    if (role === "user") {
        adminLogout().then(() => window.location.href = "/");
    }

    const handleLogout = async () => {
        const logoutResponse = window.confirm("Are you sure you want to log out?");
        if (logoutResponse) {
            const { message } = await adminLogout();
            window.location.reload();
        }
    };

    if (!token) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                    <AdminLogin />
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 p-6">
                <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
                <nav>
                    <ul className="space-y-4">
                        <li>
                            <button
                                onClick={() => setActiveSection("dashboard")}
                                className={`w-full text-left ${activeSection === "dashboard" ? "text-green-400" : "hover:text-green-400"}`}
                            >
                                Dashboard
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveSection("socials")}
                                className={`w-full text-left ${activeSection === "socials" ? "text-green-400" : "hover:text-green-400"}`}
                            >
                                Socials
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveSection("projects")}
                                className={`w-full text-left ${activeSection === "projects" ? "text-green-400" : "hover:text-green-400"}`}
                            >
                                Projects
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => window.location.href = "/"}
                                className="w-full text-left hover:text-green-400"
                            >
                                View Client Side
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left hover:text-green-400"
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-gray-900 p-8">
                {activeSection === "dashboard" && (
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-3xl font-bold text-green-400">Welcome, {name}</h2>
                        <p className="text-gray-300 mt-2">Email: {email}</p>
                    </div>
                )}
                {activeSection === "socials" && (
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                        <Socials/>
                    </div>
                )}
                {activeSection === "projects" && (
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-3xl font-bold text-green-400">Projects</h2>
                        <CreateProject />
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;