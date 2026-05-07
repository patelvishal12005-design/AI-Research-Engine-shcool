import { useState } from "react";
import axios from "axios";

export default function AIApp() {
  const [question, setQuestion] = useState("");
  const [standard, setStandard] = useState("10");
  const [answer, setAnswer] = useState("");

  const askAI = async () => {
    const res = await axios.post("http://127.0.0.1:8000/ask/", {
      question,
      standard,
    });
    setAnswer(res.data.answer);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>AI Research Engine</h2>

      <select value={standard} onChange={(e) => setStandard(e.target.value)}>
        <option value="8">Std 8</option>
        <option value="10">Std 10</option>
        <option value="12">Std 12</option>
      </select>

      <br /><br />

      <textarea
        placeholder="Enter your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={4}
        cols={50}
      />

      <br /><br />

      <button onClick={askAI}>Get Answer</button>

      <h3>Answer:</h3>
      <p>{answer}</p>
    </div>
  );
}