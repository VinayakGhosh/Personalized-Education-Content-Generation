import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfileSetup2 = () => {
  const [stream, setStream] = useState("science");
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  // Define subjects for each stream
  const streamSubjects = {
    science: ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"],
    commerce: ["Accountancy", "Business Studies", "Economics", "Mathematics", "Statistics"],
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
      stream,
      subjects
    }));
    // Navigate to next step
    navigate("/profile-setup-3");
  };

  const handleBack = () => {
    navigate("/profile-setup-1");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Academic Information
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Stream */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Stream:
            </label>
            <select
              value={stream}
              onChange={(e) => setStream(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            >
              <option value="science">Science</option>
              <option value="commerce">Commerce</option>
              <option value="arts">Arts</option>
            </select>
          </div>

          {/* Subjects Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
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
            <p className="text-sm text-gray-500 mt-2">
              Select at least one subject
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 bg-gray-500 text-white font-semibold py-2 rounded-md hover:bg-gray-600 transition duration-300"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={subjects.length === 0}
              className={`flex-1 bg-blue-500 text-white font-semibold py-2 rounded-md transition duration-300 ${
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