import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateSubject, sendChatPrompt } from "../api/api";
import { marked } from "marked";
import "../styles/subjectSelection.css";
import ClipLoader from "react-spinners/ClipLoader";

const SubjectSelectionPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greetingMessage, setGreetingMessage] = useState("");
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const name = localStorage.getItem("name");
  console.log(loading)

  useEffect(() => {


    if (!userData) {
      navigate("/profile-setup");
      return;
    }
    console.log("user data", userData);

    if (userData.subjects && userData.subjects.length > 0) {
      setSubjects(userData.subjects);
    } else {
      setSubjects(["Maths", "Science"]); // optional fallback
    }

    let firstTimeGreet =
      "The user is not a new user so greet him as a returning user";
    if (userData.isProfileComplete === true) {
      console.log("not first time");
      firstTimeGreet =
        "The user is not a new user so greet him as a returning user, don't use the word returning user, just greet the user as a returning user ";
    } else {
      console.log("first time user");
      firstTimeGreet =
        "The user has login first time and he is new here so greet him as a new user";
    }

    const fetchGreet = async () => {
      try {
        const greetPrompt = ` You are a helpful assistant that greets the user when the user lands in this page, this is the subject selection page. You must greet the user in a way that is engaging and motivating. Be creative and use the user's data to make the conversation more personal.
      ${firstTimeGreet}
      The user's name is ${name}, you should use the first name only.
      The user's selected subjects are ${userData.subjects}, if there are more than 3 subjects, you should only mention three subjects and those subjects should be at random.
      You need to greet the user and ask them to select their subjects and also say that you are here to help them with their subjects. Also say something motivating. The user's preffered tone is ${userData.tone} so you need to use that tone to talk to the user. Don't generate the response in more than 100 words. Try to be as engaging as possible. Also change the greeting to something different every time.`;
        const mode = null;
        const temperature = 1;

        const response = await sendChatPrompt(greetPrompt, mode, temperature);
        console.log("response is", response);
        setGreetingMessage(response);
      } catch (error) {
        console.error("Error getting greeting message from the prompt:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGreet();
    
  }, []);

  // useEffect(() => {

  // }, [loading])

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
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-600 to-purple-800 flex flex-col items-center justify-start p-6">
      {loading ? (<div className="flex items-center justify-center h-screen">
        <ClipLoader color={"white"} size={50} />
      </div>
        
      ) : (
        <>
          <h2 className="roboto-flex text-4xl font-bold mb-4 text-white">
            Your Subjects
          </h2>

          <div
            className="font-mono mt-2 mb-5 w-full max-w-7xl text-[#F1F1F1] text-justify font-semibold  "
            dangerouslySetInnerHTML={{ __html: marked(greetingMessage) }}
          ></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl bg-white rounded-xl p-10 shadow-lg hover:shadow-xl transition duration-200 cursor-pointer  max-h-[30rem] overflow-y-auto ">
            {subjects.map((subject) => (
              <div
                key={subject}
                onClick={() => handleSubjectClick(subject)}
                className="bg-gray-200 rounded-xl p-5 shadow-lg hover:shadow-xl transition duration-200 cursor-pointer w-[21rem] h-[11rem] text-justify border-l-4  border-[#3F51B5]"
              >
                <h3 className="text-xl space-grotesk font-semibold text-[#212121] mb-2">
                  {subject}
                </h3>
                <p className="text-[#616161] roboto-flex mb-4">
                  {subject === "Maths"
                    ? "Master numbers, equations and problem solving."
                    : subject === "Physics"
                    ? "Explore the laws of nature and the universe."
                    : subject === "Biology"
                    ? "Discover life, organisms, and ecosystems."
                    : subject === "Chemistry"
                    ? "Understand matter, reactions, and atoms."
                    : subject === "Statistics"
                    ? "Learn about data, probability, and statistics."
                    : subject === "Computer Science"
                    ? "Learn about computer systems, programming, and algorithms."
                    : subject === "Economics"
                    ? "Understand economic systems, markets, and policies."
                    : subject === "History"
                    ? "Explore past events, cultures, and societies."
                    : subject === "Geography"
                    ? "Learn about the world's physical and human geography."
                    
                    : "Learn and explore this subject in depth."}
                </p>

                {/* Dummy Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-3 mb-1">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.floor(Math.random() * 80) + 20}%` }}
                  ></div>
                </div>
                <span className="text-xs font-mono text-gray-500">
                  Progress {Math.floor(Math.random() * 80) + 20}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SubjectSelectionPage;
