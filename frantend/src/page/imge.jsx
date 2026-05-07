import { useState } from "react";
import axios from "axios";

export default function ImageUpload() {
  const [file, setFile] = useState(null);
  const [standard, setStandard] = useState("10");
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("standard", standard);

    const res = await axios.post("http://127.0.0.1:8000/upload/", formData);

    setQuestion(res.data.question);
    setAnswer(res.data.answer);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Question Image</h2>

      <select value={standard} onChange={(e) => setStandard(e.target.value)}>
        <option value="8">Std 8</option>
        <option value="10">Std 10</option>
        <option value="12">Std 12</option>
      </select>

      <br /><br />

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <br /><br />

      <button onClick={uploadImage}>Upload & Get Answer</button>

      <h3>Detected Question:</h3>
      <p>{question}</p>

      <h3>Answer:</h3>
      <p>{answer}</p>
    </div>
  );
}