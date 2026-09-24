import { useRef, useState } from "react";
import { uploadFile } from "../services/api";
import "./FileUploader.css";

function FileUploader({ onUploadComplete }) {
  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);

    if (selectedFiles.length === 0) {
      return;
    }

    setError("");
    setUploading(true);
    setProgress(0);

    try {
      // Upload files one by one
      for (const file of selectedFiles) {
        await uploadFile(file, (percentage) => {
          setProgress(percentage);
        });
      }

      setProgress(100);

      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Failed to upload file");
    } finally {
      setUploading(false);

      // Allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="upload-section">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        hidden
      />

      <button
        className="upload-button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? `Uploading ${progress}%` : "📤 Choose Files"}
      </button>

      {uploading && (
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default FileUploader;
