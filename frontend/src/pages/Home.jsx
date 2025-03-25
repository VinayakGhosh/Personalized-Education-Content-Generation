import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-500 to-purple-600 text-white w-full">
      <h1 className="text-5xl font-bold mb-4">Welcome to Edu-Chat</h1>
      <p className="text-2xl text-center max-w-xl">
        Your personalized AI-powered educational assistant. Start learning today!
      </p>
      <div className="mt-6 flex gap-4">
        <Link
          to="/login"
          className="px-6 py-3 bg-white text-blue-600 rounded-lg shadow-md hover:bg-gray-200 transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-6 py-3 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800 transition"
        >
          Signup
        </Link>
      </div>
    </div>
  );
};

export default Home;
