import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SubjectSelectionPage = () => {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get subjects from localStorage or you can use API if needed
    const userData = JSON.parse(localStorage.getItem("userData"));
    console.log(localStorage)
    console.log('user data', userData)
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
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-purple-400 w-full h-screen flex flex-col items-center justify-start p-6">
      <h2 className="text-5xl font-bold  mb-6 text-white">Choose a subject you want to learn!</h2>
      <div className="flex flex-row flex-wrap md:justify-center gap-x-2 md:gap-x-6 w-full max-w-2xl border  max-h-xl h-[85%]  p-2 md:p-4 rounded-xl justify-center items-center">
        {subjects.map((subject) => (
          <button
            key={subject}
            onClick={() => handleSubjectClick(subject)}
            className="bg-gradient-to-b from-blue-500 to-purple-600 hover:bg-gradient-to-b hover:from-blue-400 hover:to-purple-600 rounded-xl shadow-md hover:shadow-xl text-lg font-medium hover:text-gray-700 py-4 transition duration-200  text-white md:w-40 md:h-40 w-1/2 h-32 cursor-pointer grow"
          >
            {subject}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelectionPage;
