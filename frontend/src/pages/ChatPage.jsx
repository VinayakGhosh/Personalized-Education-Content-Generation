import { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { sendChatPrompt, getChaptersBySubject, getChatHistory, saveChatHistory} from "../api/api";
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
      console.log("storedSubject", storedSubject);
      const userData = JSON.parse(localStorage.getItem("userData"));
      console.log("userData", userData);

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

  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedSubject) return;
      try {
        const history = await getChatHistory(selectedSubject);
        setMessages(history || []);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
  
    fetchHistory();
  }, [selectedSubject]);
  

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
  
    const timestamp = getFormattedTime();
    const userMessage = {
      text: input,
      sender: "user",
      mode,
      timestamp,
    };
  
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
  
    // Save user message to DB
    try {
      const saveUsermsg = [{
        sender: "user",
        text: input,
      }]
      await saveChatHistory(selectedSubject, saveUsermsg);
    } catch (error) {
      console.error("Failed to save user message:", error);
    }
  
    try {
      setLoadingResponse(true);
      const botReplyText = await sendChatPrompt(input, mode, selectedSubject);
  
      const botMessage = {
        text: botReplyText,
        sender: "bot",
        timestamp: getFormattedTime(),
      };
  
      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
  
      // Save bot message to DB
      const saveBotmsg = [{
        sender: "bot",
        text: botReplyText,
      }]
      await saveChatHistory(selectedSubject, saveBotmsg);

      
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setLoadingResponse(false);
      console.log("show messages", messages)
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
    setInput(
      `Explain the topic: ${chapter} so that the concept is clear properly`
    );
    handleSendMessage(
      `Explain the topic: ${chapter} so that the concept is clear properly`
    );
  };

  const handleViewProgress = () => {
    navigate("/select-subject");
  };

  return (
    <div className="  w-full h-screen flex justify-center items-center ">
      <div className="absolute top-2 right-2 flex gap-x-3 items-center justify-center ">
        

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
        <div className="flex flex-col ">
          <div className="p-3 bg-blue-700 text-white text-xl font-medium hover:bg-blue-600 cursor-pointer text-center" onClick={handleViewProgress} > View Progress</div>

          <div className="w-64 bg-white border-r p-4 overflow-y-auto h-full">
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
        </div>

        <div className="flex flex-col w-3xl h-[90%] bg-gray-100 rounded-lg shadow-lg overflow-hidden">
          {/* Chat Header */}
          <div className="bg-blue-700 text-white text-center py-4 text-lg font-semibold shadow-md flex justify-center gap-x-4 items-center">
            Chat Assistant
            {selectedSubject && (
              <select
                value={selectedSubject}
                onChange={(e) => {
                  const newSubject = e.target.value;
                  setSelectedSubject(newSubject);
                  localStorage.setItem("selectedSubject", newSubject);
                  fetchChaptersForSubject(newSubject);
                  setMessages([]); // Optional: clear chat on subject switch
                }}
                className="px-4 py-2 border border-white rounded-lg bg-blue-600 text-white text-sm font-medium 
                          hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
                          transition-colors duration-200 ease-in-out appearance-none
                          cursor-pointer shadow-sm"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                {availableSubjects.map((subject) => (
                  <option 
                    key={subject} 
                    value={subject}
                    className="bg-white text-gray-800 hover:bg-gray-100"
                  >
                    {subject}
                  </option>
                ))}
              </select>
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
