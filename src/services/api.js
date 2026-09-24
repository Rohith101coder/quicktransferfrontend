import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// ========================================
// Get all files
// ========================================

export const getFiles = async () => {
  const response = await api.get("/files");

  return response.data;
};

// ========================================
// Upload file
// ========================================

export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },

    onUploadProgress: (event) => {
      if (!event.total) {
        return;
      }

      const progress = Math.round((event.loaded * 100) / event.total);

      if (onProgress) {
        onProgress(progress);
      }
    },
  });

  return response.data;
};

// ========================================
// Download file
// ========================================

export const downloadFile = async (fileId, fileName) => {
  const response = await api.get(`/files/${fileId}/download`, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], {
    type: response.headers["content-type"],
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};

// ========================================
// Confirm download
// ========================================

export const completeDownload = async (fileId) => {
  const response = await api.post(`/files/${fileId}/download-complete`);

  return response.data;
};

// ========================================
// Delete file
// ========================================

export const deleteFile = async (fileId) => {
  const response = await api.delete(`/files/${fileId}`);

  return response.data;
};

export default api;
