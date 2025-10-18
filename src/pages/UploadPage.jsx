// src/UploadPage.jsx

import { useRef, useState, useContext } from "react";
import { AuthContext } from "../auth-context";
import Header from "../components/Header";
import "../App.css";

function UploadPage() {
  const auth = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setAnalysisResult(null);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setAnalysisResult(null);
    const formData = new FormData();
    formData.append("image", selectedFile);
    console.log("Sending token:", auth.token); // Your spy is still good

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { Authorization: "Bearer " + auth.token },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Analysis failed.");
      }
      setAnalysisResult(data.result);
      auth.updateUser(data.user);
    } catch (error) {
      setAnalysisResult({ message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <main className="upload-box">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept="image/*"
          />
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="image-preview" />
          ) : (
            <div
              className="image-placeholder"
              onClick={() => fileInputRef.current.click()}
            >
              <p>📷</p>
              <span>Click to select a photo</span>
            </div>
          )}
          {imagePreview && (
            <button
              className="analyze-button"
              onClick={handleAnalyzeClick}
              disabled={isLoading || analysisResult}
            >
              {isLoading ? "Analyzing..." : "Analyze Image"}
            </button>
          )}
          {analysisResult && (
            <div className="result-box">
              <p>
                <strong>{analysisResult.message}</strong>
              </p>
              {analysisResult.points > 0 && (
                <p>Points Awarded: {analysisResult.points}</p>
              )}
              {analysisResult.bin && <p>Dispose in: {analysisResult.bin}</p>}

              {/* --- THIS IS THE FIX --- */}
              <p>Your new total: {auth.user.points} points!</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default UploadPage;
