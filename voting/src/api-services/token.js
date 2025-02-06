import applicationLogin from "./votes/applicationLogin";
import loginUser from "./votes/userLogiin";

let token = null;
let userToken = null;

export const getToken = async () => {
    if (!token) {
        console.log("Token is not set, calling login...");
        try {
            token = await applicationLogin();
        } catch (error) {
            console.error('Error during login:', error);
        }
    }
    return token;
};

export const getUserToken = async () => {
    try {
        userToken = await loginUser('murunga', 'Evans1324$M');
        console.log('This is token',userToken.token);
        console.log('this is message', userToken.message)
        console.log('This is error', userToken.error);
    } catch (error) {
        console.error('Error during user login:', error);
    }

}

getUserToken()

