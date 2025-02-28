import { EyeIcon, LoaderIcon } from "lucide-react";
import { useState, useEffect } from "react";
import Select from "react-select";
import { addUserTokenData } from "../../../admin-service/socials/tweeter/addUserTokenData";
import { getTwitterUsernames } from "../../../admin-service/socials/tweeter/getUsers";

const AddTwitterData = () => {
    const [showPassword, setShowPassword] = useState({
        bearerToken: false,
        apiKey: false,
        apiKeySecret: false,
        accessTokenSecret: false,
        accessToken: false,
        clientId: false,
        clientSecret: false,
        username: false,
    });
    const [formData, setFormData] = useState({
        bearerToken: "",
        apiKey: "",
        apiKeySecret: "",
        accessTokenSecret: "",
        accessToken: "",
        clientId: "",
        clientSecret: "",
        username: "",
    });

    const [options, setOptions] = useState([]);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsernames = async () => {
            try {
                const response = await getTwitterUsernames();
                setOptions(
                    response.data.map((user) => ({
                        label: user.username,
                        value: user.username,
                    }))
                );
            } catch (error) {
                console.error("Error fetching usernames:", error);
            }
        };
        fetchUsernames();
    }, []);

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
        setLoading(true);
        try {
            const { message } = await addUserTokenData(
                formData.bearerToken,
                formData.apiKey,
                formData.apiKeySecret,
                formData.accessTokenSecret,
                formData.accessToken,
                formData.clientId,
                formData.clientSecret,
                formData.username
            );
            setMessage(message);
        } catch (e) {
            setMessage(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUsernameChange = (option) => {
        setFormData({ ...formData, username: option.value });
    };

    return (
        <div className="space-y-4 text-gray-900">
            {Object.keys(showPassword).map((key) => (
                <label key={key} className="block">
                    <span className="text-gray-700">{key.split(/(?=[A-Z])/).join(" ")}</span>
                    <div className="relative">
                        <input
                            type={showPassword[key] ? "text" : "password"}
                            className="form-input mt-1 block w-full bg-white"
                            name={key}
                            value={formData[key]}
                            onChange={handleInputChange}
                        />
                        <EyeIcon
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer ${
                                showPassword[key] ? "text-gray-700" : "text-gray-400"
                            }`}
                            size={20}
                            onClick={() => handleTogglePassword(key)}
                        />
                    </div>
                </label>
            ))}
            <label className="block">
                <span className="text-gray-700">Username</span>
                <div className="relative">
                    <Select
                        name="username"
                        value={options.find((option) => option.value === formData.username)}
                        onChange={handleUsernameChange}
                        options={options}
                        placeholder="Select a username"
                    />
                </div>
            </label>
            <p className="text-red-500 mt-2">{message}</p>
            <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? <LoaderIcon className="animate-spin" size={20} /> : "Submit"}
            </button>
        </div>
    );
};

export default AddTwitterData;