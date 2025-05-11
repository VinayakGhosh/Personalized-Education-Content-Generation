import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

const ProfileSetup2 = () => {
  const [stream, setStream] = useState("science");
  const [subjects, setSubjects] = useState([]);
  const [studyLevel, setStudyLevel] = useState("novice");
  const [studyGoal, setStudyGoal] = useState("preparing-for-exam");
  const navigate = useNavigate();

  // Define subjects for each stream
  const streamSubjects = {
    science: ["Maths", "Physics", "Chemistry", "Biology", "Computer Science", "Statistics", "Economics", "History", "Geography"],
    commerce: ["Accountancy", "Business Studies", "Economics", "Maths", "Statistics"],
    arts: ["History", "Geography", "Political Science", "Psychology", "Sociology", "English Literature"]
  };

  useEffect(() => {
    // Check if user has completed first step
    const profileData = localStorage.getItem("profileData");
    if (!profileData) {
      navigate("/profile-setup-1");
    }
  }, [navigate]);

  // Reset subjects when stream changes
  useEffect(() => {
    setSubjects([]);
  }, [stream]);

  const handleSubjectChange = (subject) => {
    setSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Get existing data from localStorage
    const existingData = JSON.parse(localStorage.getItem("profileData"));
    // Update with new data
    localStorage.setItem("profileData", JSON.stringify({
      ...existingData,
      subjects,
      study_level: studyLevel,
      study_goal: studyGoal
    }));
    // Navigate to next step
    navigate("/profile-setup-3");
  };

  const handleBack = () => {
    navigate("/profile-setup-1");
  };

  return (
    <div className="profile-setup-class w-full flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">Step 2 of 3</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '66%' }}></div>
          </div>
        </div>

        <h2 className=" roboto-flex text-2xl font-bold text-center text-gray-800 mb-4">
          Academic Information
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Subjects Selection */}
          <div>
            <label className="block font-[monospace] text-base text-gray-700 font-medium mb-2">
              Select Your Subjects:
            </label>
            <div className="flex flex-wrap gap-2">
              {streamSubjects[stream].map((subject) => (
                <label
                  key={subject}
                  className={`cursor-pointer px-3 py-1 border rounded-md ${
                    subjects.includes(subject)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "border-gray-300 text-gray-700"
                  }`}
                  onClick={() => handleSubjectChange(subject)}
                >
                  {subject}
                </label>
              ))}
            </div>
            <p className="text-sm font-sans text-gray-500 mt-2">
              Select at least one subject
            </p>
          </div>

          {/* Study Level Selection */}
          <div>
            <label className="block font-[monospace] text-base text-gray-700 font-medium mb-2">
              Study Level:
            </label>
            <select
              value={studyLevel}
              onChange={(e) => setStudyLevel(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            >
              <option value="novice">Novice</option>
              <option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Study Goal Selection */}
          <div>
            <label className="block font-[monospace] text-base text-gray-700 font-medium mb-2">
              Your Goal:
            </label>
            <select
              value={studyGoal}
              onChange={(e) => setStudyGoal(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            >
              <option value="preparing for an exam">Preparing for Exam</option>
              <option value="general awareness">Learning for General Awareness</option>
              <option value="updating knowledge">Updating Myself with New Subjects</option>
            </select>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 bg-gray-500 text-white font-semibold py-2 rounded-md hover:bg-gray-600 transition duration-300 cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={subjects.length === 0}
              className={`flex-1 bg-blue-500 text-white font-semibold py-2 rounded-md transition duration-300 cursor-pointer ${
                subjects.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup2;