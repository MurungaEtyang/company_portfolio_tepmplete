import { apiUrl } from "../api_url";

export const logout = async () => {

    try {
        const response = await fetch(`${apiUrl.baseUrl}/api/kenf/nimrod/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            credentials: 'include'
        });

        if (response.ok) {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("last_name");
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_email");
            localStorage.removeItem("role");
            // localStorage.clear();

            return {
                message: "Logged out successfully",
            };
        } else if (response.status === 403) {
            localStorage.clear();
            return {
                message: "You are not logged in",
            };
        } else {
            throw new Error("Failed to log out");
        }
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};