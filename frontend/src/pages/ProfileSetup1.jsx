import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfileSetup1 = () => {
  const [age, setAge] = useState("");
  const [studyLevel, setStudyLevel] = useState("school");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store in localStorage temporarily
    localStorage.setItem("profileData", JSON.stringify({
      age,
      study_level: studyLevel
    }));
    // Navigate to next step
    navigate("/profile-setup-2");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-xl">
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

          {/* Study Level */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Study Level:
            </label>
            <select
              value={studyLevel}
              onChange={(e) => setStudyLevel(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            >
              <option value="school">School</option>
              <option value="college">College</option>
              <option value="university">University</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup1; 