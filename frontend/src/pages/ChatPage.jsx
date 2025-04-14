import { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { sendChatPrompt, getChaptersBySubject } from "../api/api";
import ClipLoader from "react-spinners/ClipLoader";
import { marked } from "marked";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [mode, setMode] = useState("Explain"); // Default mode
  const [selectedSubject, setSelectedSubject] = useState("");
  const [chapters, setChapters] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);

  const navigate = useNavigate();

  // Ref for the chat container
  const chatContainerRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const fetchChapters = async () => {
      const storedSubject = localStorage.getItem("selectedSubject");
      const userData = JSON.parse(localStorage.getItem("userData"));

      if (!storedSubject) {
        navigate("/select-subject");
      } else {
        setSelectedSubject(storedSubject);
        setAvailableSubjects(userData.subjects || []);
        fetchChaptersForSubject(storedSubject);
      }
    };

    fetchChapters();
  }, []);

  const fetchChaptersForSubject = async (subject) => {
    try {
      const data = await getChaptersBySubject(subject);
      setChapters(data.chapters || []);
    } catch (error) {
      console.error("Failed to fetch chapters:", error);
    }
  };

  // Function to format timestamp
  const getFormattedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: "user",
      mode,
      timestamp: getFormattedTime(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    try {
      setLoadingResponse(true);
      const botResponse = await sendChatPrompt(input, mode, selectedSubject);
      setMessages((prev) => [
        ...prev,
        { text: botResponse, sender: "bot", timestamp: getFormattedTime() },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Error getting response!",
          sender: "bot",
          timestamp: getFormattedTime(),
        },
      ]);
      console.error("error with chat response");
    } finally {
      setLoadingResponse(false);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("selectedSubject");
      navigate("/login");
    }
  };

  const handleChapterClick = (chapter) => {
    setInput(`Explain the topic: ${chapter} so that the concept is clear properly`);
    handleSendMessage(`Explain the topic: ${chapter} so that the concept is clear properly`);
  };

  const handleViewProgress = () =>{
    navigate("/select-subject")
  }
  

  return (
    <div className="  w-full h-screen flex justify-center items-center ">
      <div className="absolute top-2 right-2 flex gap-x-3 items-center justify-center ">
        {/* Subject selection dropdown */}
        <div className=" px-6">
          <select
            value={selectedSubject}
            onChange={(e) => {
              const newSubject = e.target.value;
              setSelectedSubject(newSubject);
              localStorage.setItem("selectedSubject", newSubject);
              fetchChaptersForSubject(newSubject);
              setMessages([]); // Optional: clear chat on subject switch
            }}
            className="p-2 border rounded-md bg-white text-black"
          >
            {availableSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {/* Log out button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition  cursor-pointer"
        >
          Logout
        </button>
      </div>

      <div className="flex w-full gap-x-20  h-[100%] bg-gray-100 rounded-lg shadow-lg overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r p-4 overflow-y-auto">
          <h3 className="text-lg font-bold mb-4">Chapters</h3>
          <ul className="space-y-2">
            {chapters.map((chapter, index) => (
              <li
                key={index}
                className="block w-full text-left p-2 mb-2 bg-white rounded hover:bg-gray-200 transition cursor-pointer"
                onClick={() => handleChapterClick(chapter)}
              >
                {chapter}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col w-3xl h-[90%] bg-gray-100 rounded-lg shadow-lg overflow-hidden">
          {/* Chat Header */}
          <div className="bg-blue-700 text-white text-center py-4 text-lg font-semibold shadow-md">
            Chat Assistant
            {selectedSubject && (
              <span className="text-sm italic text-gray-200">
                {" "}
                ({selectedSubject})
              </span>
            )}
          </div>

          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F5F5F5] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-green-300"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-x-1 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 max-w-[75%] text-sm rounded-lg shadow-md ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-300 text-black rounded-bl-none"
                  }`}
                  style={{ whiteSpace: "pre-line" }}
                  dangerouslySetInnerHTML={{ __html: marked(msg.text) }}
                >
                  {/* {msg.text} */}
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {msg.timestamp}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input & Mode Selector */}
          <div className="flex items-center p-4 bg-white border-t shadow-md">
            {/* Mode Selector */}
            <select
              className="p-3  rounded-lg mr-3 bg-gray-200 focus:ring-2 focus:ring-blue-400"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="Explain">Explain</option>
              <option value="Quiz">Quiz</option>
              <option value="Test">Generate Ques</option>
            </select>

            <input
              type="text"
              className="flex-1 p-3 border rounded-full outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />

            <button
              onClick={handleSendMessage}
              className="ml-3 mt-1 p-4 bg-blue-700 text-white rounded-full hover:bg-[#205781] transition duration-200 cursor-pointer"
            >
              {loadingResponse ? (
                <ClipLoader color={"white"} size={20} />
              ) : (
                <FiSend size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
