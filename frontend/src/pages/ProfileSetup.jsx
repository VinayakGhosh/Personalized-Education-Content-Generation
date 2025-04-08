import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setupProfile } from "../api/api"; // API function to send profile data

const ProfileSetup = () => {
  const [age, setAge] = useState("");
  const [studyLevel, setStudyLevel] = useState("school");
  const [stream, setStream] = useState("science");
  const [subjects, setSubjects] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const navigate = useNavigate();

  const handleSubjectChange = (subject) => {
    setSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };
  console.log(age)
  console.log(studyLevel)
  console.log(stream)
  console.log(subjects)
  console.log(preferences)

  const handlePreferenceChange = (preference) => {
    setPreferences((prev) =>
      prev.includes(preference) ? prev.filter((p) => p !== preference) : [...prev, preference]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id")
    console.log("user id is: ", userId)
    try {
      await setupProfile(
        {user_id:userId, age, study_level: studyLevel, stream, subjects, preferences },
        token
      );
      navigate("/select-subject"); // Redirect to subject selection page
    } catch (error) {
      console.error("Profile setup failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Complete Your Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Age Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Age:</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Study Level */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Study Level:</label>
            <select
              value={studyLevel}
              onChange={(e) => setStudyLevel(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            >
              <option value="school">School</option>
              <option value="college">College</option>
            </select>
          </div>

          {/* Stream */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Stream:</label>
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
            <label className="block text-gray-700 font-medium mb-2">Subjects:</label>
            <div className="flex flex-wrap gap-2">
              {["Maths", "Physics", "Chemistry", "Biology"].map((subject) => (
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
          </div>

          {/* Preferences Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Preferences:</label>
            <div className="flex flex-wrap gap-2">
              {["Videos", "Quizzes", "Articles"].map((pref) => (
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

          {/* Submit Button */}
          <button
          
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
