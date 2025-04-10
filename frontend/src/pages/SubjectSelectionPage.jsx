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
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-purple-400 w-[100vw] h-screen flex flex-col items-center justify-start p-6">
      <h2 className="text-5xl font-bold  mb-6 text-white">Choose a subject you want to learn!</h2>
      <div className="flex flex-row flex-wrap md:justify-center gap-x-2 md:gap-x-6 w-[80%] lg:max-w-[70%] border-2 shadow-xl border-gray-200  max-h-xl h-[85%]  p-2 md:p-4 rounded-xl justify-center ">
        {subjects.map((subject) => (
          <button
            key={subject}
            onClick={() => handleSubjectClick(subject)}
            className="bg-gradient-to-b from-blue-500 to-purple-600 hover:bg-gradient-to-b hover:from-blue-400 hover:to-purple-600 rounded-xl shadow-md hover:shadow-xl text-lg font-medium hover:text-gray-700 py-4 transition duration-200  text-white md:w-40 md:h-40 w-1/2 h-40 cursor-pointer "
          >
            {subject}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelectionPage;
