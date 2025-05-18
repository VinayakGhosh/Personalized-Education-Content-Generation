import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChatPage from "./pages/ChatPage";
import ShowProfile from "./pages/ShowProfile";
import ProfileSetup1 from "./pages/ProfileSetup1";
import ProfileSetup2 from "./pages/ProfileSetup2";
import ProfileSetup3 from "./pages/ProfileSetup3";
import ProtectedRoute from "./components/ProtectRoute"; // Import ProtectedRoute
import SubjectSelectionPage from "./pages/SubjectSelectionPage";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/show-profile"
            element={
              <ProtectedRoute>
                <ShowProfile />
              </ProtectedRoute>
            }
          />
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
