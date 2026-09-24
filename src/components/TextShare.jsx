import { useState } from "react";

import { sendText, completeText, deleteText } from "../services/api";
import "./TextShare.css";
function TextShare({ texts, onTextChange }) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!content.trim()) {
      return;
    }

    setError("");
    setSending(true);

    try {
      await sendText(content);

      setContent("");

      if (onTextChange) {
        onTextChange();
      }
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Failed to share text");
    } finally {
      setSending(false);
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text.content);

      // Copy successful → remove from server
      await completeText(text.id);

      if (onTextChange) {
        onTextChange();
      }
    } catch (error) {
      console.error(error);

      setError("Failed to copy text");
    }
  };

  const handleDelete = async (textId) => {
    try {
      await deleteText(textId);

      if (onTextChange) {
        onTextChange();
      }
    } catch (error) {
      console.error(error);

      setError("Failed to delete text");
    }
  };

  return (
    <section className="text-section">
      <div className="section-header">
        <h2>Share Text</h2>

        <span>
          {texts.length} text
          {texts.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="text-input-area">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Type or paste text here..."
          maxLength={1024 * 1024}
        />

        <div className="text-input-footer">
          <span>{content.length.toLocaleString()} characters</span>

          <button
            className="send-text-button"
            onClick={handleSend}
            disabled={sending || !content.trim()}
          >
            {sending ? "Sending..." : "Send Text"}
          </button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {texts.length > 0 && (
        <div className="text-list">
          {texts.map((text) => (
            <div className="text-item" key={text.id}>
              <div className="text-content">{text.content}</div>

              <div className="text-actions">
                <button
                  className="copy-text-button"
                  onClick={() => handleCopy(text)}
                >
                  Copy
                </button>

                <button
                  className="delete-text-button"
                  onClick={() => handleDelete(text.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default TextShare;
