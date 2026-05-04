import { useState } from "react";
import api from "../../services/api";

function ResumeUpload({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const uploadResume = async () => {
    if (!file) {
      alert("Please select resume");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);

      const res = await api.post("/candidate/profile/resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Resume uploaded successfully");

      if (onUploaded) {
        onUploaded(res.data);
      }
    } catch (err) {
      alert(err.response?.data?.detail || "Resume upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white border p-5 shadow-sm">
      <h2 className="font-semibold text-gray-800">Resume</h2>
      <p className="text-sm text-gray-500 mt-1">
        Upload PDF, DOC or DOCX resume before applying.
      </p>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setFile(e.target.files[0])}
        className="mt-4"
      />

      <button
        type="button"
        onClick={uploadResume}
        disabled={uploading}
        className="block mt-4 bg-indigo-600 text-white px-4 py-2 font-medium disabled:opacity-60"
      >
        {uploading ? "Uploading..." : "Upload Resume"}
      </button>
    </div>
  );
}

export default ResumeUpload;