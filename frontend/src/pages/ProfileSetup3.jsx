import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setupProfile } from "../api/api";

const ProfileSetup3 = () => {
  const [preferences, setPreferences] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get existing data from localStorage
    const data = localStorage.getItem("profileData");
    if (!data) {
      navigate("/profile-setup-1");
      return;
    }
    setProfileData(JSON.parse(data));
  }, [navigate]);

  const handlePreferenceChange = (preference) => {
    setPreferences((prev) =>
      prev.includes(preference)
        ? prev.filter((p) => p !== preference)
        : [...prev, preference]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");
      
      // Combine all data
      const finalProfileData = {
        ...profileData,
        preferences,
        user_id: userId
      };

      // Send to backend
      await setupProfile(finalProfileData, token);

      // Store in localStorage
      localStorage.setItem("userData", JSON.stringify(finalProfileData));
      
      // Clear temporary profile data
      localStorage.removeItem("profileData");
      
      // Navigate to subject selection
      navigate("/select-subject");
    } catch (error) {
      console.error("Profile setup failed:", error);
    }
  };

  const handleBack = () => {
    navigate("/profile-setup-2");
  };

  if (!profileData) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Preferences & Review
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preferences Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Learning Preferences:
            </label>
            <div className="flex flex-wrap gap-2">
              {["Tests", "Quizzes", "Videos", "Text-based", "Interactive"].map((pref) => (
                <label
                  key={pref}
                  className={`cursor-pointer px-3 py-1 border rounded-md ${
                    preferences.includes(pref)
                      ? "bg-green-500 text-white border-green-500"
                      : "border-gray-300 text-gray-700"
                  }`}
                  onClick={() => handlePreferenceChange(pref)}
                >
                  {pref}
                </label>
              ))}
            </div>
          </div>

          {/* Review Section */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Review Your Information:</h3>
            <div className="space-y-2 text-gray-600">
              <p><span className="font-medium">Age:</span> {profileData.age}</p>
              <p><span className="font-medium">Study Level:</span> {profileData.study_level}</p>
              <p><span className="font-medium">Stream:</span> {profileData.stream}</p>
              <p><span className="font-medium">Subjects:</span> {profileData.subjects.join(", ")}</p>
            </div>
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
              className="flex-1 bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Complete Setup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup3; 