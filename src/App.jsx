import { useCallback, useEffect, useState } from "react";

import FileUploader from "./components/FileUploader";
import FileList from "./components/FileList";
import TextShare from "./components/TextShare";
import { getFiles, getTexts } from "./services/api";

import "./index.css";

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [texts, setTexts] = useState([]);

  const fetchFiles = useCallback(async () => {
    try {
      const data = await getFiles();

      setFiles(data.files || []);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTexts = useCallback(async () => {

    try {

        const data = await getTexts();

        setTexts(data.texts || []);

    } catch (error) {

        console.error(
            "Failed to fetch texts:",
            error
        );
    }

}, []);

  // Initial fetch
  useEffect(() => {
    fetchFiles();
    fetchTexts();
  }, [fetchFiles, fetchTexts]);

  // Poll every 3 seconds
useEffect(() => {
  const interval = setInterval(() => {
    fetchFiles();
    fetchTexts();
  }, 3000);

  return () => {
    clearInterval(interval);
  };
}, [fetchFiles, fetchTexts]);

  const handleUploadComplete = () => {
    fetchFiles();
  };

  const handleFileDeleted = (fileId) => {
    setFiles((currentFiles) =>
      currentFiles.filter((file) => file.id !== fileId),
    );
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Quick Transfer</h1>

        <p>Simple file sharing between your devices</p>
      </header>

      <main className="container">
        <section className="upload-card">
          <h2>Send files</h2>

          <p>Upload from your phone or laptop</p>

          <FileUploader onUploadComplete={handleUploadComplete} />
        </section>

        <TextShare texts={texts} onTextChange={fetchTexts} />

        <section className="files-section">
          <div className="section-header">
            <h2>Available Files</h2>

            <span>
              {files.length} file
              {files.length !== 1 ? "s" : ""}
            </span>
          </div>

          <FileList
            files={files}
            loading={loading}
            onFileDeleted={handleFileDeleted}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
