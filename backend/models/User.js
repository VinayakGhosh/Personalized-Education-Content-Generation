// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    learningStyle: { type: String, default: "visual" },
    difficultyLevel: { type: String, default: "beginner" },
  },
  progress: [
    {
      moduleId: String,
      score: Number,
      completed: Boolean,
    },
  ],
});

export default mongoose.model("User", userSchema);