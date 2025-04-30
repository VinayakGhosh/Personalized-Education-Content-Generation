import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChatPage from "./pages/ChatPage";
import ProfileSetup1 from "./pages/ProfileSetup1";
import ProfileSetup2 from "./pages/ProfileSetup2";
import ProfileSetup3 from "./pages/ProfileSetup3";
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
            path="/profile-setup-1" 
            element={ 
              <ProtectedRoute>
                <ProfileSetup1 />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile-setup-2" 
            element={ 
              <ProtectedRoute>
                <ProfileSetup2 />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile-setup-3" 
            element={ 
              <ProtectedRoute>
                <ProfileSetup3 />
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
