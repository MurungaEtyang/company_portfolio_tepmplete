import React from "react";

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">

            <div className="d-flex">

                <div className="main-content p-4" style={{ flex: 1 }}>
                    <h1>Welcome to the Admin Dashboard</h1>
                    <p>Here you can manage users, view reports, and configure settings.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
