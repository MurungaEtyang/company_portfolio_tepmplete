import {apiUrl} from "../api_url";

export const bookApplication = async (appointmentDate, mpsName, purpose) => {
    const response = await fetch(`${apiUrl.baseUrl}/api/kenf/nimrod/book-appointment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ appointmentDate, mpsName, purpose })
    });
    const data = await response.json();
    if (response.ok) {
        return {
            message: data.message
        };
    } else {
        throw new Error(data.message);
    }
}


export const getAppointments = async () => {
    const response = await fetch(`${apiUrl.baseUrl}/api/kenf/nimrod/user-appointments`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
    });

    const data = await response.json();
    if (response.ok) {
        return data;
    } else {
        throw new Error(data.message);
    }
}




