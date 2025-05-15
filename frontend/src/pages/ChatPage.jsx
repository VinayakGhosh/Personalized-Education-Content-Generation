"use client";

import { useState, useEffect, useRef } from "react";
import {
  sendChatPrompt,
  getChaptersBySubject,
  getChatHistory,
  saveChatHistory,
} from "../api/api";
import { marked } from "marked";
import { useNavigate } from "react-router-dom";
import {
  Send,
  LogOut,
  BookOpen,
  ChevronDown,
  BarChart,
  Bot,
  User,
  Loader2,
  ChevronUp,
} from "lucide-react";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [mode, setMode] = useState("Explain"); // Default mode
  const [selectedSubject, setSelectedSubject] = useState("");
  const [chapters, setChapters] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const chatContainerRef = useRef(null);
  const modeDropdownRef = useRef(null);
  const subjectDropdownRef = useRef(null);

  const storedSubject = localStorage.getItem("selectedSubject");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const name = localStorage.getItem("name");
  console.log('user data is: ', userData)
  console.log('name is: ', name)

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        modeDropdownRef.current &&
        !modeDropdownRef.current.contains(event.target)
      ) {
        setModeDropdownOpen(false);
      }
      if (
        subjectDropdownRef.current &&
        !subjectDropdownRef.current.contains(event.target)
      ) {
        setSubjectDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    const fetchChapters = async () => {
      if (!storedSubject) {
        navigate("/select-subject");
      } else {
        setSelectedSubject(storedSubject);
        setAvailableSubjects(userData?.subjects || []);
        fetchChaptersForSubject(storedSubject);
      }
    };

    fetchChapters();
  }, [navigate]);

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
      const saveUsermsg = [
        {
          sender: "user",
          text: input,
        },
      ];
      await saveChatHistory(selectedSubject, saveUsermsg);
    } catch (error) {
      console.error("Failed to save user message:", error);
    }

    try {
      setLoadingResponse(true);
      const botReplyText = await sendChatPrompt(input, mode, 0.8);

      const botMessage = {
        text: botReplyText,
        sender: "bot",
        timestamp: getFormattedTime(),
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);

      // Save bot message to DB
      const saveBotmsg = [
        {
          sender: "bot",
          text: botReplyText,
        },
      ];
      await saveChatHistory(selectedSubject, saveBotmsg);
    } catch (error) {
      console.error("Chat error:", error);
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
    setInput("");
    const message = `You have to explain the topic: ${chapter} to the user, so that they can understand the  concept. While explaining the user you should know about the user and generate response based on that data.
    The use's highest education is of level ${userData.highest_education} so generate the explanation according to the user's level of understanding.
    The user prefers ${userData.language_complexity} content.
    The user's preffered tone is ${userData.preferred_tone}, so generate the response in that tone.
    The user's study goal is for ${userData.study_goal}, the content should be helpful for the user according to their goal.
    The user's study preference is ${userData.study_level}.
    The user has available time ${userData.available_time}, if the available time is less than 4-8 then generate content in range of 300 to 400 words otherwise generate the content in the range of more than 450 words.
    The user's content preferences are ${userData.content_preferences}, if the content preferences include test or quiz, then after explaining the topic, give user some test or quiz questions based on his preference related to that topic and then give the answer also in italics font.
    All the data that I have provided you about the user, don't tell them in the chat. In your response text, there should only be content related to the topic and adjust it based on the data that i have provided you. In your response highlght and do proper formatting of text using markdown. The response should also include sub topics related to that topic and highlight each heading with bigger font and bold. Also add line break after each paragraph.
    `;
    setInput(message);

    // Create and add the message manually
    const timestamp = getFormattedTime();
    const userMessage = {
      text: chapter,
      sender: "user",
      mode,
      timestamp,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    // Continue with the API call
    const sendMessage = async () => {
      try {
        // Save user message to DB
        const saveUsermsg = [
          {
            sender: "user",
            text: chapter,
            // msgPrompt: message
          },
        ];
        await saveChatHistory(selectedSubject, saveUsermsg);

        setLoadingResponse(true);
        const botReplyText = await sendChatPrompt(message, mode, 0.7);

        const botMessage = {
          text: botReplyText,
          sender: "bot",
          timestamp: getFormattedTime(),
        };

        const finalMessages = [...updatedMessages, botMessage];
        setMessages(finalMessages);

        // Save bot message to DB
        const saveBotmsg = [
          {
            sender: "bot",
            text: botReplyText,
          },
        ];
        await saveChatHistory(selectedSubject, saveBotmsg);
      } catch (error) {
        console.error("Chat error:", error);
      } finally {
        setLoadingResponse(false);
      }
    };

    sendMessage();
  };

  const handleViewProgress = () => {
    navigate("/select-subject");
  };

  const handleSubjectChange = (subject) => {
    setSelectedSubject(subject);
    localStorage.setItem("selectedSubject", subject);
    fetchChaptersForSubject(subject);
    setMessages([]);
    setSubjectDropdownOpen(false);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setModeDropdownOpen(false);
  };

  return (
    <div className="flex w-full h-screen bg-slate-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } transition-all duration-300 h-full bg-white border-r border-slate-200 flex flex-col overflow-hidden`}
      >
        <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-800 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Edu-Chat
            </h2>
            <button
              className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        </div>

        <button
          className="mx-4 mt-4 py-2 px-3 rounded-md flex items-center gap-2 text-slate-700 hover:text-blue-700 hover:bg-purple-50 transition-colors"
          onClick={handleViewProgress}
        >
          <BarChart className="h-5 w-5" />
          View Progress
        </button>

        <div className="h-px bg-slate-200 my-4 mx-4"></div>

        <div className="px-4 mb-2">
          <h3 className="text-sm font-medium text-slate-500 mb-2">CHAPTERS</h3>
        </div>

        <div className="flex-1 px-4 overflow-y-auto">
          <div className="space-y-1 pb-4">
            {chapters.map((chapter, index) => (
              <button
                key={index}
                className="w-full py-2 px-3 rounded-md text-left font-normal text-slate-700 hover:text-blue-700 hover:bg-purple-50 transition-colors"
                onClick={() => handleChapterClick(chapter)}
              >
                {chapter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 shadow-sm">
          {!sidebarOpen && (
            <button
              className="p-2 rounded-md hover:bg-slate-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <BookOpen className="h-5 w-5" />
            </button>
          )}

          <div className="flex items-center gap-2">
            {selectedSubject && (
              <div className="relative" ref={subjectDropdownRef}>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                  onClick={() => setSubjectDropdownOpen(!subjectDropdownOpen)}
                >
                  <span>{selectedSubject}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {subjectDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-[180px] bg-white border border-slate-200 rounded-md shadow-lg z-10">
                    {availableSubjects.map((subject) => (
                      <button
                        key={subject}
                        className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors"
                        onClick={() => handleSubjectChange(subject)}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            className="px-4 py-2 text-sm rounded-md border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </header>

        {/* Chat Area */}
        <div
          ref={chatContainerRef}
          className="flex-1 p-4 bg-slate-50 overflow-y-auto"
        >
          <div className="max-w-3xl mx-auto space-y-4 pb-20">
            {messages.length === 0 && (
              <div className="text-center py-10">
                <Bot className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-700">
                  Start a conversation
                </h3>
                <p className="text-slate-500 mt-2">
                  Select a chapter from the sidebar or ask a question below
                </p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex items-start max-w-[80%] gap-3">
                  {msg.sender === "bot" && (
                    <div className="h-8 w-8 rounded-full bg-purple-100 text-blue-700 flex items-center justify-center mt-1">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div
                    className={`rounded-lg shadow-sm p-3 ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-blue-500 to-purple-700 text-white"
                        : "bg-white"
                    }`}
                  >
                    <div
                      className={`prose prose-sm max-w-none ${
                        msg.sender === "user" ? "text-white" : "text-slate-800"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: marked(msg.text),
                      }}
                    />
                    <div
                      className={`text-xs mt-1 ${
                        msg.sender === "user"
                          ? "text-purple-200"
                          : "text-slate-400"
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.sender === "user" && (
                    <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mt-1">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loadingResponse && (
              <div className="flex justify-start">
                <div className="flex items-start max-w-[80%] gap-3">
                  <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mt-1">
                    <Bot className="h-4 w-4" />
                  </div>

                  <div className="rounded-lg shadow-sm p-3 bg-white">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                      <span className="text-sm text-slate-500">
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="max-w-3xl mx-auto flex gap-2">
            <div className="relative" ref={modeDropdownRef}>
              <button
                className="px-4 py-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex items-center gap-2"
                onClick={() => setModeDropdownOpen(!modeDropdownOpen)}
              >
                <span>{mode}</span>
                {modeDropdownOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              {modeDropdownOpen && (
                <div className="absolute top-0 left-0 mt-[-120px] w-[130px] bg-white border border-slate-200 rounded-md shadow-lg z-10">
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors"
                    onClick={() => handleModeChange("Explain")}
                  >
                    Explain
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors"
                    onClick={() => handleModeChange("Quiz")}
                  >
                    Quiz
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors"
                    onClick={() => handleModeChange("Test")}
                  >
                    Generate Ques
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 relative">
              <input
                className="w-full px-4 py-2 pr-10 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSendMessage()
                }
              />
              <button
                className={`absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full ${
                  input.trim() && !loadingResponse
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    : "bg-gray-300"
                } text-white transition-colors`}
                onClick={handleSendMessage}
                disabled={loadingResponse || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
