import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChatPage from "./pages/ChatPage";
import ProfileSetup from "./pages/ProfileSetup";
import ProtectedRoute from "./components/ProtectRoute"; // Import ProtectedRoute
import SubjectSelectionPage from "./pages/SubjectSelectionPage";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/profile-setup" 
            element={ 
              <ProtectedRoute>
                <ProfileSetup />
              </ProtectedRoute>
              
            
            } 
            />
            <Route path="/select-subject" element={<SubjectSelectionPage />} />
          

          {/* Protect ChatPage route */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
