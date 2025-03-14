import { useState } from "react";
import { signupUser } from "../services/api";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    const response = await signupUser({ email, password });

    if (response.error) {
      setMessage(response.error);
    } else {
      setMessage("Signup successful! You can now login.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-6 bg-white shadow-md rounded-md">
        <h2 className="text-xl font-bold mb-4">Signup</h2>
        {message && <p className="text-red-500">{message}</p>}
        <form onSubmit={handleSignup}>
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
          <button className="bg-blue-500 text-white px-4 py-2 w-full">Signup</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
