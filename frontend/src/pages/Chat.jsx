import React, { useState } from "react";
import { sendChatMessage } from "../services/api";

const Chat = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!userInput.trim()) return;
    
    // Add user message to chat
    setMessages([...messages, { user: userInput, bot: "..." }]);

    try {
      const response = await sendChatMessage(userInput);
      setMessages((prev) => [...prev.slice(0, -1), { user: userInput, bot: response.response }]);
    } catch (error) {
      console.error("Chat API Error:", error);
      setMessages((prev) => [...prev.slice(0, -1), { user: userInput, bot: "Error fetching response." }]);
    }

    setUserInput("");
  };

  return (
    <div>
      <h2>Chat with AI</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <p key={index}><strong>You:</strong> {msg.user} <br /><strong>AI:</strong> {msg.bot}</p>
        ))}
      </div>
      <input 
        type="text" 
        value={userInput} 
        onChange={(e) => setUserInput(e.target.value)} 
        placeholder="Type your message..." 
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default Chat;
