import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setupProfile } from "../api/api";
import "../styles/profile.css";

const ProfileSetup3 = () => {
  const [contentPreferences, setContentPreferences] = useState([]);
  const [languageComplexity, setLanguageComplexity] = useState("simple");
  const [preferredTone, setPreferredTone] = useState("friendly");
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
    setContentPreferences((prev) =>
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
        content_preferences: contentPreferences,
        language_complexity: languageComplexity,
        preferred_tone: preferredTone,
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
    <div className="profile-setup-class w-full flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">Step 3 of 3</span>
            
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        <h2 className="roboto-flex text-2xl font-bold text-center text-gray-800 mb-4">
         Your Learning Preferences
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preferences Selection */}
          <div>
            <label className="block font-[monospace] text-base text-gray-700 font-medium mb-2">
              What is your preferred type of content:
            </label>
            <div className="flex flex-wrap gap-2">
              {["Text Content", "Interactive", "Test", "Quiz"].map((pref) => (
                <label
                  key={pref}
                  className={`cursor-pointer px-3 py-1 border rounded-md ${
                    contentPreferences.includes(pref)
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

          {/* Tone Selection */}
          <div>
            <label className="block font-[monospace] text-base text-gray-700 font-medium mb-2">
              Preferred Tone:
            </label>
            <select
              value={preferredTone}
              onChange={(e) => setPreferredTone(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            >
              <option value="friendly and casual">Friendly and casual</option>
              <option value="formal">Formal</option>
              <option value="motivational">Motivational</option>
              <option value="professional">Professional</option>
              <option value="humorous">Humorous</option>
              <option value="encouraging">Encouraging</option>
            </select>
          </div>

          {/* Language Complexity */}
          <div>
            <label className="block font-[monospace] text-base text-gray-700 font-medium mb-2">
              Expected language type:
            </label>
            <select
              value={languageComplexity}
              onChange={(e) => setLanguageComplexity(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            >
              <option value="Simple and easy to understand">Simple and easy to understand</option>
              <option value="Academically inclined Language">Academically inclined Language</option>
              <option value="Technical and Complex">Technical and Complex</option>
              <option value="Professional and Clear">Professional and Clear</option>
              <option value="Descriptive and Detailed">Descriptive and Detailed</option>
              <option value="Narrative or Storytelling Style">Narrative or Storytelling Style</option>
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
              className="flex-1 bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-300 cursor-pointer"
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