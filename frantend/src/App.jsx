import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { UploadCloud, FileImage, Sparkles, Loader2, Send } from 'lucide-react';
import './index.css';

function App() {
  const [file, setFile] = useState(null);
  const [standard, setStandard] = useState('10');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a paper image first.");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('standard', standard);

    try {
      const response = await axios.post('http://127.0.0.1:8000/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("There was an error analyzing the paper. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: 'user', content: chatInput };
    setChatHistory((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/ask/', {
        question: chatInput
      });
      setChatHistory((prev) => [...prev, { role: 'ai', content: response.data.answer }]);
    } catch (error) {
      console.error("Error asking AI:", error);
      setChatHistory((prev) => [...prev, { role: 'ai', content: "Sorry, there was an error processing your request." }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>AI Paper Examiner</h1>
        <p>Upload exam questions to get detailed answers and paper presentation tips</p>
      </header>

      <main className="glass-panel">
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Select Standard / Grade</label>
            <select 
              className="select-input" 
              value={standard} 
              onChange={(e) => setStandard(e.target.value)}
            >
              {[...Array(12)].map((_, i) => (
                <option key={i+1} value={i+1}>Standard {i+1}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Upload Paper Image</label>
            <div 
              className={`upload-area ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleChange} 
                id="file-upload" 
              />
              <UploadCloud className="upload-icon" size={48} />
              <div className="upload-text">
                <p>Drag and drop your image here or <span>browse</span></p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Supports JPG, PNG</p>
              </div>
            </div>
            
            {file && (
              <div className="file-preview">
                <FileImage size={20} color="#a855f7" />
                <span>{file.name}</span>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading || !file}
          >
            {loading ? (
              <><Loader2 className="spinner" size={24} /> Analyzing Paper...</>
            ) : (
              <><Sparkles size={24} /> Get Answer & Tips</>
            )}
          </button>
        </form>

        {result && (
          <div className="result-container glass-panel" style={{ marginTop: '2rem', background: 'rgba(15, 23, 42, 0.6)' }}>
            <h3 style={{ marginBottom: '1rem', color: '#a855f7', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
              Extracted Question:
            </h3>
            <p style={{ fontStyle: 'italic', marginBottom: '2rem', color: '#cbd5e1' }}>
              {result.question}
            </p>

            <h3 style={{ marginBottom: '1rem', color: '#6366f1', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
              AI Answer & Writing Guide:
            </h3>
            <div className="markdown-body">
              <ReactMarkdown>{result.answer}</ReactMarkdown>
            </div>

            <div className="chat-section" style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', color: '#a855f7' }}>
                Still have doubts? Ask the AI Teacher
              </h3>
              
              <div className="chat-history" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '400px', overflowY: 'auto' }}>
                {chatHistory.map((msg, idx) => (
                  <div key={idx} style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    background: msg.role === 'user' ? 'var(--primary)' : 'rgba(0,0,0,0.3)',
                    padding: '1rem',
                    borderRadius: '1rem',
                    maxWidth: '85%',
                    border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.05)' : 'none'
                  }}>
                    {msg.role === 'ai' ? (
                      <div className="markdown-body"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                ))}
                {chatLoading && (
                  <div style={{ alignSelf: 'flex-start', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '1rem' }}>
                    <Loader2 className="spinner" size={20} color="#a855f7" />
                  </div>
                )}
              </div>

              <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '1rem' }}>
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your question here..."
                  className="select-input"
                  style={{ flex: 1, backgroundImage: 'none' }}
                />
                <button type="submit" disabled={chatLoading || !chatInput.trim()} className="submit-btn" style={{ width: 'auto', padding: '0 1.5rem' }}>
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
