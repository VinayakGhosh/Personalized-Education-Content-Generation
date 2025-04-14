import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateSubject} from "../api/api";

const SubjectSelectionPage = () => {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();



  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
      navigate("/profile-setup");
      return;
    }
  
    if (userData.subjects && userData.subjects.length > 0) {
      setSubjects(userData.subjects);
    } else {
      setSubjects(["Maths", "Science"]); // optional fallback
    }
  }, []);

  const handleSubjectClick = async (subject) => {
    try {
      await updateSubject(subject); // 🔄 PATCH request
      localStorage.setItem("selectedSubject", subject);
      navigate("/chat");
    } catch (error) {
      alert("Failed to update selected subject.");
      console.error("Error updating subject:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-400 to-purple-400 flex flex-col items-center justify-start p-6">
    <h2 className="text-5xl font-bold mb-6 text-white">Your Subjects</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
      {subjects.map((subject) => (
        <div
          key={subject}
          onClick={() => handleSubjectClick(subject)}
          className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition duration-200 cursor-pointer"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {subject}
          </h3>
          <p className="text-gray-600 mb-4">
            {subject === "Maths"
              ? "Master numbers, equations and problem solving."
              : subject === "Physics"
              ? "Explore the laws of nature and the universe."
              : subject === "Biology"
              ? "Discover life, organisms, and ecosystems."
              : subject === "Chemistry"
              ? "Understand matter, reactions, and atoms."
              : "Learn and explore this subject in depth."}
          </p>

          {/* Dummy Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
            <div
              className="bg-green-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.floor(Math.random() * 80) + 20}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500">Progress {Math.floor(Math.random() * 80) + 20}%</span>
        </div>
      ))}
    </div>
  </div>
  );
};

export default SubjectSelectionPage;
