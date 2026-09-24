import FileItem from "./FileItem";

function FileList({ files, loading, onFileDeleted }) {
  if (loading) {
    return <div className="empty-state">Loading files...</div>;
  }

  if (files.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>

        <p>No files available</p>

        <span>Upload something from your phone or laptop.</span>
      </div>
    );
  }

  return (
    <div className="file-list">
      {files.map((file) => (
        <FileItem key={file.id} file={file} onFileDeleted={onFileDeleted} />
      ))}
    </div>
  );
}

export default FileList;
