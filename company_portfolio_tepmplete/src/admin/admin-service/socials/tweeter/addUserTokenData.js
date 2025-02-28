import {apiUrl} from "../../../../services/api_url";

export const addUserTokenData = async (bearerToken, api_key, api_key_secret, access_token_secret, access_token, client_id, client_secret, username) => {
    try{
        const response = await fetch(`${apiUrl.baseUrl}/api/kenf/nimrod/x-username/get-user-id`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("admin_token")}`
            },
            body: JSON.stringify(
                {
                    "bearer_token": bearerToken,
                    "api_key": api_key,
                    "api_key_secret": api_key_secret,
                    "access_token_secret": access_token_secret,
                    "access_token": access_token,
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "username": username
                }
            )
        });
        const data = await response.json();
        if (response.ok) {
            return {
                message: data.message,
            };
        } else {
            throw new Error(data.message);
        }
    }catch (e) {
        throw new Error(e);
    }
};