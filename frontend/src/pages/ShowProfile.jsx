"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Clock,
  GraduationCap,
  Target,
  MessageSquare,
  Settings,
  Globe,
  BarChart,
  ChevronLeft,
  Edit,
} from "lucide-react";
import { getUserProfile } from "../api/api";
import EditProfileModal from "../components/EditProfileModal";

const ShowProfile = () => {
  const userProfileData = JSON.parse(localStorage.getItem("userData"));
  // const name = localStorage.getItem("name");
  const token = localStorage.getItem("token");
  console.log("token: ", token);

  const navigate = useNavigate();
  const [userData, setUserData] = useState(userProfileData);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    // Fetch user data from localStorage or API
    const fetchUserData = async () => {
      setLoading(true)
      try {
        // For demo purposes, using mock data
        // In a real app, you would fetch this from an API

        const response = await getUserProfile(token);
        console.log("response is: ", response);
        setUserData(response);

        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleBackToChat = () => {
    navigate("/select-subject");
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      // Here you would typically make an API call to update the profile
      // For now, we'll just update the local state
      setUserData(updatedData);
      localStorage.setItem("userData", JSON.stringify(updatedData));
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToChat}
              className="flex items-center gap-2 text-white hover:bg-white/10 rounded-md px-3 py-2 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Back to Subjects</span>
            </button>

            <h1 className="text-2xl font-bold">User Profile</h1>

            <button 
              onClick={handleEditProfile}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-md px-3 py-2 transition-colors"
            >
              <Edit className="h-5 w-5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-600/10 to-indigo-600/10 px-6 py-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="h-24 w-24 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                {userData.name.charAt(0)}
              </div>

              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-slate-800">
                  {userData.name}
                </h2>
                <p className="text-slate-500 mt-1">Age: {userData.age}</p>

                
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-8">
            {/* Education & Study Info */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-purple-600" />
                  Education & Study Information
                </h3>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">
                      Highest Education
                    </h4>
                    <p className="text-slate-800">
                      {(userData.highest_education).toUpperCase()}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">
                      Study Level
                    </h4>
                    <p className="text-slate-800">{(userData.study_level).toUpperCase()}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">
                      Available Time
                    </h4>
                    <p className="text-slate-800 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      {userData.available_time} hrs
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">
                      Study Goal
                    </h4>
                    <p className="text-slate-800 flex items-center gap-2">
                      <Target className="h-4 w-4 text-slate-400" />
                      {(userData.study_goal).toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Preferences */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  Learning Preferences
                </h3>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">
                      Preferred Tone
                    </h4>
                    <p className="text-slate-800 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-slate-400" />
                      {(userData.preferred_tone).toUpperCase()}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">
                      Language Complexity
                    </h4>
                    <p className="text-slate-800 flex items-center gap-2">
                      <Globe className="h-4 w-4 text-slate-400" />
                      {(userData.language_complexity).toUpperCase()}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2">
                    Content Preferences
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {userData?.content_preferences?.map((preference, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                      >
                        {preference}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Subjects */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  Subjects
                </h3>
              </div>

              <div className="p-6">
                <ul className="space-y-2">
                  {userProfileData.subjects.map((subject, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-slate-50"
                    >
                      <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                        {index + 1}
                      </div>
                      <span className="text-slate-800">{subject}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Progress */}
            {/* <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-purple-600" />
                  Progress
                </h3>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {Object.entries(userData.progress).map(
                    ([subject, progress]) => (
                      <div key={subject}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-slate-700">
                            {subject}
                          </span>
                          <span className="text-sm font-medium text-slate-700">
                            {progress}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                          <div
                            className="h-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </main>

      {/* Add the EditProfileModal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={userData}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default ShowProfile;
