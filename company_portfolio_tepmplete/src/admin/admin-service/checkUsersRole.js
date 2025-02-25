import { apiUrl } from "../../services/api_url";

export const checkUserRole = async () => {
    const token = localStorage.getItem("admin_token");

    try {
        const response = await fetch(`${apiUrl.baseUrl}/api/kenf/nimrod/check-user-role`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            return {
                success: true,
                message: data.message,
                authorized: data.authorized
            };
        } else {
            return {
                success: false,
                message: data.message || "Failed to verify role",
                authorized: false
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error.message || "Network error occurred",
            authorized: false
        };
    }
};
