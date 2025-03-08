import { useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    setLoadingResponse(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/generate/", {
        prompt: prompt,
      });

      setResponse(res.data.generated_text);
    } catch (error) {
      setResponse("Error: Could not fetch response");
      console.error("API error:", error);
    } finally {
      setLoadingResponse(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20 ">
      <h2 className="bg-green-600 text-white font-semibold px-2 py-1 rounded-md text-2xl">
        Chat With Me
      </h2>
      <textarea
        rows="2"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter prompt..."
        style={{ width: "100%", padding: "10px" }}
        className="border-black border rounded-md bg-slate-100 text-gray-900 text-base font-normal "
      />
      <button
        className="cursor-pointer bg-amber-500 text-base text-white w-full py-1 rounded-md"
        onClick={handleSend}
      >
        send
      </button>
      <div
        style={{ marginTop: "10px", padding: "10px", background: "#f4f4f4" }}
      >
        {loadingResponse? (
          <div className="flex justify-center">
          <ClipLoader color="purple" size={20} />
          </div>
          ): (
          <div>
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
        )}
        
      </div>
    </div>
  );
}

export default App;
