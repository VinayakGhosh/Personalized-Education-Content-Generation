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

// User profile collection 
export const setupProfile = async (profileData) => {
  const token = localStorage.getItem("token");
  try {
    await axios.post(`${API_URL}/user/profile/setup`, profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// fetch user data
export const getUserProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/user/profile/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateSubject = async (subject) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.patch(
      `${API_URL}/user/profile/subject`,
      { last_selected_subject: subject }, // request body
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // return parsed JSON response
  } catch (error) {
    // Axios error handling
    const message =
      error.response?.data?.detail || "Failed to update subject";
    throw new Error(message);
  }
};

// get chapters by subject
export const getChaptersBySubject = async (subject) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/chapters/${subject}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // { chapters: [...] }
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return { chapters: [] }; // fallback on error
  }
};


// get chat history
export const getChatHistory = async (subject) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/chat/history/${subject}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.messages || [];
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
};

// save chat history
export const saveChatHistory = async (subject, messages) => {
  try {
    const token = localStorage.getItem("token");
    await axios.post(
      `${API_URL}/chat/chatSave`,
      { subject, messages },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error("Error saving chat history:", error);
    throw error;
  }
};



//chat api call
export const sendChatPrompt = async (message, mode, temp) => {
  try {
    const response = await axios.post(`${API_URL}/chat/generate`, {
      prompt: message,
      mode: mode,
      temperature: temp // Send the selected mode
    });
 console.log("response is: ", response)
    return response.data.generated_text; // Assuming backend returns { "response": "text" }
  } catch (error) {
    console.error("Error sending chat prompt:", error);
    return "Error getting response from AI.";
  }
};

// Update user profile
export const updateProfile = async (profileData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.patch(
      `${API_URL}/user/profile/me`,
      profileData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error.response?.data || { detail: "Failed to update profile" };
  }
};
