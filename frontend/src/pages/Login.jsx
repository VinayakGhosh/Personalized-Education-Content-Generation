import { useState } from "react";
import { loginUser } from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await loginUser({ email, password });

    if (response.error) {
      setMessage(response.error);
    } else {
      localStorage.setItem("token", response.token);
      setMessage("Login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/chat"; // Redirect to chat
      }, 1000);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-6 bg-white shadow-md rounded-md">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        {message && <p className="text-red-500">{message}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 w-full mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="bg-blue-500 text-white px-4 py-2 w-full">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
