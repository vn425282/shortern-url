import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

// URL Validation Function
const isValidUrl = (url) => {
  const urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  return urlRegex.test(url);
};

// URL Normalization Function
const normalizeUrl = (url) => {
  if (!/^https?:\/\//i.test(url)) {
    // If the URL doesn't start with http:// or https://, prepend http://
    return `http://${url}`;
  }
  return url;
};

const HomePage = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl("");

    // Normalize the URL
    const normalizedUrl = normalizeUrl(url);
    // Validate the URL
    if (!isValidUrl(normalizedUrl)) {
      setError("Please enter a valid URL.");
      return;
    }

    try {
      // Send the normalized URL to the backend
      const response = await axios.post("http://localhost:5000/shorten", {
        originalUrl: normalizedUrl,
      });
      setShortUrl(`http://localhost:5000/${response.data.shortUrl}`);
    } catch (err) {
      setError("Failed to shorten the URL. Please try again.");
    }
  };

  return (
    <div className="wrapper">
      <div className="container">
        <h1 className="title">URL Shortener Application</h1>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your URL here"
            className="input"
          />
          <button type="submit" className="button">
            Shorten URL
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        {shortUrl && (
          <div className="result">
            <p>Shortened URL:</p>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              {shortUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
