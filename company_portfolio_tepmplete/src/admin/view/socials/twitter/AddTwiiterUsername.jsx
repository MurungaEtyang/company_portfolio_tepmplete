import {EyeIcon, LoaderIcon} from "lucide-react";
import {useState} from "react";
import {addTweeterUsers} from "../../../admin-service/socials/tweeter/addUsers";

const AddTwitterUsername = () => {
    const [showPassword, setShowPassword] = useState({
        bearerToken: false,
        
        username: false,
    });
    const [formData, setFormData] = useState({
        bearerToken: "",
        
        username: "",
    });

    const [messages, setMessages] = useState("")
    const [loading, setLoading] = useState(false)

    const handleTogglePassword = (name) => {
        setShowPassword((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };

    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true)
        try {
            const { message } = await addTweeterUsers(formData.username, formData.bearerToken)
            setMessages(message)
            console.log(formData);
        }catch (e) {
            setMessages(e.message);
        } finally {
            setLoading(false)
        }

    };



    return (
        <div className="space-y-4 text-gray-900">
            <label className="block">
                <span className="text-gray-700">Bearer Token</span>
                <div className="relative">
                    <input
                        type={showPassword.bearerToken ? "text" : "password"}
                        className="form-input mt-1 block w-full bg-white"
                        name="bearerToken"
                        value={formData.bearerToken}
                        onChange={handleInputChange}
                    />
                    <EyeIcon
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer ${
                            showPassword.bearerToken ? "text-gray-700" : "text-gray-400"
                        }`}
                        size={20}
                        onClick={() => handleTogglePassword("bearerToken")}
                    />
                </div>
            </label>


            <label className="block">
                <span className="text-gray-700">Username</span>
                <div className="relative">
                    <input
                        type= "text"
                        className="form-input mt-1 block w-full bg-white"
                        name="username"
                        placeholder={'Dont use @ username just username eg murunga'}
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                </div>
            </label>

            <p className="text-red-500 mt-2">{messages}</p>
            <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? <LoaderIcon className="animate-spin h-5 w-5 mr-2" /> : null}
                Submit
            </button>
        </div>
    );
};

export default AddTwitterUsername;