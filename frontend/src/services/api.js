const API_URL = "http://127.0.0.1:8000"; // Update if using a different backend URL

// Function to handle user signup
export const signupUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return response.json();
  } catch (error) {
    console.error("Signup Error:", error);
    return { error: "Signup failed" };
  }
};

// Function to handle user login
export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return response.json();
  } catch (error) {
    console.error("Login Error:", error);
    return { error: "Login failed" };
  }
};


// Function to send chat messages to backend
export const sendChatMessage  = async (prompt) => {
    try {
      const response = await fetch(`${API_URL}/chat/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
  
      return response.json();
    } catch (error) {
      console.error("Chat Error:", error);
      return { error: "Failed to fetch response" };
    }
  };
