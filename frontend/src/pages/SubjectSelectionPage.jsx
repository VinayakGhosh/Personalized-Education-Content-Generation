import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SubjectSelectionPage = () => {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get subjects from localStorage or you can use API if needed
    const userData = JSON.parse(localStorage.getItem("userData"));
    console.log(localStorage)
    if (userData?.subjects) {
      setSubjects(userData.subjects);
    } else {
      // fallback in case data is missing
      setSubjects(["Maths", "Science"]);
    }
  }, []);

  const handleSubjectClick = (subject) => {
    localStorage.setItem("selectedSubject", subject);
    navigate("/chat");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 w-full h-screen flex flex-col items-center justify-start p-6">
      <h2 className="text-4xl font-bold  mb-6 text-white">Choose a Subject</h2>
      <div className="flex flex-wrap md:justify-center gap-2 md:gap-4 w-full max-w-xl border border-black max-h-xl h-[85%] bg-white">
        {subjects.map((subject) => (
          <button
            key={subject}
            onClick={() => handleSubjectClick(subject)}
            className="bg-gradient-to-b from-blue-600 to-purple-800 rounded-xl shadow-md hover:shadow-xl text-lg font-medium text-gray-700 py-4 transition duration-200 border border-gray-300 hover:bg-blue-100 md:w-40 md:h-40"
          >
            {subject}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelectionPage;
