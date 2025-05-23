import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, getUserProfile } from "../api/api"; // Import API function

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const loginResponse = await loginUser({ email, password });
      localStorage.setItem("token", loginResponse.token); // Store JWT token
      localStorage.setItem("user_id", loginResponse.user_id);
      localStorage.setItem("name", loginResponse.name);
      console.log("userId", loginResponse.user_id);
      console.log(loginResponse);

      if (loginResponse.profile_complete === true) {
        console.log('Fetching user profile...');
        const profileResponse = await getUserProfile(loginResponse.token);
        console.log('Profile response:', profileResponse);
        localStorage.setItem("userData", JSON.stringify(profileResponse));
        localStorage.setItem("selectedSubject", profileResponse.last_selected_subject);
        navigate("/select-subject"); // Redirect to chat if profile is complete
      } else {
        navigate("/profile-setup-1"); // Redirect to first profile setup page
      }
    } catch (err) {
      setError(err.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 w-full">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            required
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            required
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition cursor-pointer"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
