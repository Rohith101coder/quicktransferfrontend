import { useState } from "react";
import { downloadFile, completeDownload, deleteFile } from "../services/api";

function FileItem({ file, onFileDeleted }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    setError("");
    setDownloading(true);

    try {
      await downloadFile(file.id, file.name);

      // Tell backend download completed
      await completeDownload(file.id);

      // Remove from current UI
      if (onFileDeleted) {
        onFileDeleted(file.id);
      }
    } catch (error) {
      console.error(error);

      setError("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFile(file.id);

      if (onFileDeleted) {
        onFileDeleted(file.id);
      }
    } catch (error) {
      console.error(error);

      setError("Failed to delete file.");
    }
  };

  const isImage = file.type?.startsWith("image/");
  const isVideo = file.type?.startsWith("video/");
  const isPdf = file.type === "application/pdf";

  return (
    <div className="file-item">
      <div className="file-preview">
        {isImage ? (
          <span>🖼️</span>
        ) : isVideo ? (
          <span>🎬</span>
        ) : isPdf ? (
          <span>📕</span>
        ) : (
          <span>📄</span>
        )}
      </div>

      <div className="file-info">
        <div className="file-name">{file.name}</div>

        <div className="file-size">{file.sizeFormatted}</div>
      </div>

      <div className="file-actions">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="download-button"
        >
          {downloading ? "Downloading..." : "Download"}
        </button>

        <button onClick={handleDelete} className="delete-button">
          Delete
        </button>
      </div>

      {error && <div className="file-error">{error}</div>}
    </div>
  );
}

export default FileItem;
