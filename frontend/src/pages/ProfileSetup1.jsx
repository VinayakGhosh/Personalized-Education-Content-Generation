import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";
import { marked } from "marked";
import { sendChatPrompt } from "../api/api.js";
import ClipLoader from "react-spinners/ClipLoader";

const ProfileSetup1 = () => {
  const [age, setAge] = useState("");
  const [highestEducation, setHighestEducation] = useState("school");
  const [availableTime, setAvailableTime] = useState("1-2");
  const [greetingMessage, setGreetingMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  useEffect(() => {
    const fetchGreet = async () => {
      setLoading(true)
      const greetPrompt = `You are a helpful assistant that greets the user when the user lands in this page, 
      First of all greet the user by saying, "Hello ${name.split(" ")[0]}, welcome to EduChat!", use the first name only.
      Then be funny and informative about yourself.
      The overall content should be till 30 words`
      const mode = null
      const temperature = 1
      const response = await sendChatPrompt(greetPrompt, mode, temperature);
      console.log("response is", response)
      setGreetingMessage(response)
      setLoading(false)
    }
    fetchGreet();
  }, [name]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store in localStorage temporarily
    localStorage.setItem("profileData", JSON.stringify({
      age,
      highest_education: highestEducation,
      available_time: availableTime
    }));
    // Navigate to next step
    navigate("/profile-setup-2");
  };

  return (
    <div className="profile-setup-class flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 w-full  ">
      
      {loading ? (<ClipLoader color={"white"} size={50} />) : (
        <>
        <p className="text-2xl font-bold text-center text-gray-100 mb-3 max-w-5xl" dangerouslySetInnerHTML={{ __html: marked(greetingMessage) }}></p>
       <p className="text-2xl font-bold text-center text-gray-100 mb-6 max-w-3xl"> Please complete your profile to get started.</p>
      <div className="bg-white shadow-lg rounded-lg p-8 w-xl">
      
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">Step 1 of 3</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '33%' }}></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Basic Information
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Age Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Age:</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              min="5"
              max="100"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Highest Education */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Highest Education:
            </label>
            <select
              value={highestEducation}
              onChange={(e) => setHighestEducation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            >
              <option value="school">School</option>
              <option value="college">College</option>
              <option value="masters">Masters</option>
              <option value="phd">PhD</option>
            </select>
          </div>

          {/* Available Time */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Available Study Time (per day):
            </label>
            <select
              value={availableTime}
              onChange={(e) => setAvailableTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            >
              <option value="1-2">1-2 hours</option>
              <option value="2-4">2-4 hours</option>
              <option value="4-8">4-8 hours</option>
              <option value="8+">More than 8 hours</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="px-8 bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-300 cursor-pointer"
          >
            Next
          </button>
        </form>
      </div>
      </>)}
       
       
    </div>
  );
};

export default ProfileSetup1;