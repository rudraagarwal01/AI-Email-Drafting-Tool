import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateEmail = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    setLoading(true);
    setError(null);
    setEmail('');
    setCopied(false);

    try {
      const response = await fetch('http://127.0.0.1:8000/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Failed to generate email');
      const data = await response.json();
      setEmail(data.email);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="mt-4 text-white">Enter a prompt and generate an AI email:</p>

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Follow-up email after a client call"
          className="mt-4 p-2 rounded text-black w-3/4 max-w-md"
        />

        <button
          onClick={handleGenerateEmail}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Email'}
        </button>

        {error && <p className="mt-4 text-red-400">{error}</p>}

        {email && (
          <div className="mt-6 text-left max-w-xl mx-auto text-white">
            <h2 className="text-lg font-semibold mb-2">Generated Email:</h2>
            <p className="whitespace-pre-line">{email}</p>

            <button
              onClick={handleCopy}
              className="mt-3 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
