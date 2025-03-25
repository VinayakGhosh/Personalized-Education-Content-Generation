import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // Backend URL


// Signup API Call
export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, userData);
    return response.data;
  } catch (error) {
    console.error("Signup Error:", error.response?.data || error.message);
    throw error.response?.data || { detail: "Signup failed" };
  }
};

// Login API Call
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, userData);
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error.response?.data || { detail: "Login failed" };
  }
};


//chat api call
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
