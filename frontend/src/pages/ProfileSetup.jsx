import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "../api/api";

const ProfileSetup = () => {
  const [age, setAge] = useState("");
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  const handleSubjectChange = (subject) => {
    setSubjects((prevSubjects) =>
      prevSubjects.includes(subject)
        ? prevSubjects.filter((s) => s !== subject)
        : [...prevSubjects, subject]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!age || subjects.length === 0) {
      alert("Please enter your age and select at least one subject.");
      return;
    }

    const profileData = { age, subjects };

    try {
      await updateUserProfile(profileData);
      alert("Profile setup completed!");
      navigate("/subject-selection"); // Redirect to subject selection page
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("Error updating profile. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 w-full">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Set Up Your Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            placeholder="Enter your age"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <div className="mt-4">
            <p className="text-lg font-semibold">Select Subjects:</p>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="Maths"
                  onChange={() => handleSubjectChange("Maths")}
                  checked={subjects.includes("Maths")}
                />
                Maths
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="Science"
                  onChange={() => handleSubjectChange("Science")}
                  checked={subjects.includes("Science")}
                />
                Science
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
