import { useState } from "react";
import { FiSend } from "react-icons/fi";
import { sendChatPrompt } from "../api/api";
import ClipLoader from "react-spinners/ClipLoader";
import { marked } from "marked";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [mode, setMode] = useState("Explain"); // Default mode
  const navigate = useNavigate()

   // Function to format timestamp
   const getFormattedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user", mode, timestamp: getFormattedTime() };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    try {
      setLoadingResponse(true);
      const botResponse = await sendChatPrompt(input, mode);
      console.log('botResponse', botResponse)
      setMessages((prev) => [...prev, { text: botResponse, sender: "bot", timestamp: getFormattedTime() }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Error getting response!", sender: "bot", timestamp: getFormattedTime() },
      ]);
      console.error("error with chat response");
    } finally {
      setLoadingResponse(false);
      
    }
  };
  console.log(messages)

  const handleLogout = () => {
    alert('Do you want to log out?')
    localStorage.removeItem("token"); // Remove token
    navigate("/login"); // Redirect to login
  };  

  return (
    <div className="h-screen flex justify-center items-center ">
       <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition absolute top-2 right-2 cursor-pointer"
          >
            Logout
          </button>
      <div className="flex flex-col w-3xl h-[90%] bg-gray-100 rounded-lg shadow-lg overflow-hidden">
        {/* Chat Header */}
        <div className="bg-[#4F959D] text-white text-center py-4 text-lg font-semibold shadow-md">
          Chat Assistant
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F5F5F5] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-green-300">
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
                    ? "bg-[#4F959D] text-white rounded-br-none"
                    : "bg-gray-300 text-black rounded-bl-none"
                }`}
                style={{ whiteSpace: "pre-line" }}
                dangerouslySetInnerHTML={{ __html: marked(msg.text) }}
              >
                {/* {msg.text} */}
                
              </div>
              <div className="text-xs text-gray-500 mt-1 text-right">{msg.timestamp}</div>
            </div>
          ))}
        </div>

        {/* Chat Input & Mode Selector */}
        <div className="flex items-center p-4 bg-white border-t shadow-md">
          {/* Mode Selector */}
          <select
            className="p-3 border rounded-lg mr-3 bg-gray-200 focus:ring-2 focus:ring-blue-400"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="Explain">Explain</option>
            <option value="Quiz">Quiz</option>
            <option value="Summarize">Summarize</option>
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
            className="ml-3 mt-1 p-4 bg-[#4F959D] text-white rounded-full hover:bg-[#205781] transition duration-200 cursor-pointer"
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
  );
};

export default ChatPage;
