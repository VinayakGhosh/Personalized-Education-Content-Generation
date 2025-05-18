import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import { updateProfile } from "../api/api";
import { toast } from "react-toastify";

const EditProfileModal = ({ isOpen, onClose, userData, onSave }) => {
  const [formData, setFormData] = useState({
    name: userData.name || "",
    age: userData.age || "",
    highest_education: userData.highest_education || "",
    study_level: userData.study_level || "",
    available_time: userData.available_time || "",
    study_goal: userData.study_goal || "",
    preferred_tone: userData.preferred_tone || "",
    language_complexity: userData.language_complexity || "",
    content_preferences: userData.content_preferences || [],
    subjects: userData.subjects || [],
  });

  const [newSubject, setNewSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContentPreferenceChange = (preference) => {
    setFormData((prev) => ({
      ...prev,
      content_preferences: prev.content_preferences.includes(preference)
        ? prev.content_preferences.filter((p) => p !== preference)
        : [...prev.content_preferences, preference],
    }));
  };

  const handleAddSubject = () => {
    if (newSubject.trim() && !formData.subjects.includes(newSubject.trim())) {
      setFormData((prev) => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()],
      }));
      setNewSubject("");
    }
  };

  const handleRemoveSubject = (subjectToRemove) => {
    alert(`Do you want to remove subject: ${subjectToRemove}`);
    console.log("sub", subjectToRemove);
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((subject) => subject !== subjectToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Format the data according to the API requirements
      const profileData = {
        age: formData.age,
        highest_education: formData.highest_education,
        available_time: formData.available_time,
        study_level: formData.study_level,
        study_goal: formData.study_goal,
        subjects: formData.subjects,
        content_preferences: formData.content_preferences,
        language_complexity: formData.language_complexity,
        preferred_tone: formData.preferred_tone,
      };

      await updateProfile(profileData);
      onSave(formData); // Update local state
      toast.success("Profile updated successfully!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
      onClose();
    } catch (err) {
      const errorMessage =
        err.detail || "Failed to update profile. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* Education Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Highest Education
                </label>
                <select
                  name="highest_education"
                  value={formData.highest_education}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="school">School</option>
                  <option value="college">College</option>
                  <option value="masters">Masters</option>
                  <option value="phd">PhD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Study Level
                </label>
                <select
                  name="study_level"
                  value={formData.study_level}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="novice">Novice</option>
                  <option value="basic">Basic</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>

            {/* Study Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Time (hours)
                </label>
                <select
                  type="number"
                  name="available_time"
                  value={formData.available_time}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="1-2">1-2 hours</option>
                  <option value="2-4">2-4 hours</option>
                  <option value="4-8">4-8 hours</option>
                  <option value="8+">More than 8 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Study Goal
                </label>
                <select
                  name="study_goal"
                  value={formData.study_goal}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="exam preparation">Preparing for exam</option>
                  <option value="general awareness">
                    Learning for general gwareness
                  </option>
                  <option value="updating knowledge">
                    Updating myself with new subjects
                  </option>
                  <option value="hobby learning">
                    Want to learn something just for hobby
                  </option>
                  <option value="project research ">
                    Doing research for a project
                  </option>
                </select>
              </div>
            </div>

            {/* Learning Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Tone
                </label>
                <select
                  name="preferred_tone"
                  value={formData.preferred_tone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="friendly and casual">
                    Friendly and casual
                  </option>
                  <option value="formal">Formal</option>
                  <option value="motivational">Motivational</option>
                  <option value="professional">Professional</option>
                  <option value="humorous">Humorous</option>
                  <option value="encouraging">Encouraging</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language Complexity
                </label>
                <select
                  name="language_complexity"
                  value={formData.language_complexity}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="Simple and easy to understand">
                    Simple and easy to understand
                  </option>
                  <option value="Academically inclined Language">
                    Academically inclined Language
                  </option>
                  <option value="Technical and Complex">
                    Technical and Complex
                  </option>
                  <option value="Professional and Clear">
                    Professional and Clear
                  </option>
                  <option value="Descriptive and Detailed">
                    Descriptive and Detailed
                  </option>
                  <option value="Narrative or Storytelling Style">
                    Narrative or Storytelling Style
                  </option>
                </select>
              </div>
            </div>

            {/* Subjects Management */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subjects
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Add a new subject"
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.subjects.map((subject) => (
                  <div
                    key={subject}
                    className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-md"
                  >
                    <span>{subject}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(subject)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Preferences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Preferences
              </label>
              <div className="flex flex-wrap gap-2">
                {["Text Content", "Interactive", "Test", "Quiz"].map((pref) => (
                  <label
                    key={pref}
                    className={`cursor-pointer px-3 py-1 border rounded-md ${
                      formData.content_preferences.includes(pref)
                        ? "bg-purple-600 text-white border-purple-600"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => handleContentPreferenceChange(pref)}
                  >
                    {pref}
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
