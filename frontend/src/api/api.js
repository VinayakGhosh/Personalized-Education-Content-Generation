import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // Backend URL

export const sendChatPrompt = async (message, mode) => {
  try {
    const response = await axios.post(`${API_URL}/chat/generate`, {
      prompt: message,
      mode: mode, // Send the selected mode
    });
 console.log("response is: ", response)
    return response.data.generated_text; // Assuming backend returns { "response": "text" }
  } catch (error) {
    console.error("Error sending chat prompt:", error);
    return "Error getting response from AI.";
  }
};
