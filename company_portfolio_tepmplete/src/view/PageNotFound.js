import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-6xl font-bold text-red-500">404</h1>
            <p className="text-2xl text-gray-600 mb-4">Page Not Found</p>
            <p className="text-lg text-gray-600 mb-8">
                The page you are looking for might have been removed, had its name
                changed, or is temporarily unavailable.
            </p>
            <button
                onClick={handleGoHome}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Go Home
            </button>
        </div>
    );
};

export default PageNotFound;