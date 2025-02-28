import {useState} from "react";
import AddTweeterData from "./AddTweeterData";
import AddTwitterUsername from "./AddTwiiterUsername";

const Socials = () => {
  const [showNext, setShowNext] = useState(false);

  const handleNextClick = () => {
    setShowNext(true);
  };

  const handleBackClick = () => {
    setShowNext(false);
  };

  return (
    <div className="space-y-4 text-gray-900">
      {!showNext ? (
        <div>
          <button onClick={handleNextClick} className="bg-blue-500 text-white px-4 py-2 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </button>
          <AddTwitterUsername/>
        </div>
      ) : (
        <div>
          <button onClick={handleBackClick} className="bg-gray-500 text-white px-4 py-2 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <AddTweeterData/>
        </div>
      )}
    </div>
  );
};

export default Socials;