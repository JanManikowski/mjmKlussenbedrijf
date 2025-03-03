import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// If using toastify for immediate feedback:
import { toast } from "react-toastify";

const AddCategoryModal = ({ onAddCategory }) => {
  const [categoryName, setCategoryName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      // Show a quick preview
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    // Make sure both name and file are set
    if (!categoryName.trim() || !selectedFile) {
      // If using toastify
      toast.error("Please provide both a name and select an image.");
      return;
    }

    setUploading(true);

    try {
      // 1) Upload the file to Firebase Storage
      const storage = getStorage();
      const storageRef = ref(storage, `categories/${selectedFile.name}`);
      await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(storageRef);

      // 2) Call the parent's onAddCategory with name + the new image URL
      await onAddCategory({ name: categoryName, image: downloadURL });

      // 3) Clear local state (optional)
      setCategoryName("");
      setSelectedFile(null);
      setPreviewUrl("");

      // If using toastify, you can also show success here,
      // but it might be redundant if the parent also shows a toast.
      // toast.success("Category added successfully!");
    } catch (error) {
      console.error("Error uploading category image:", error);
      toast.error("Failed to add category. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="categoryModal"
      tabIndex="-1"
      aria-labelledby="categoryModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div
          className="modal-content"
          style={{ backgroundColor: "#1a1a1a", color: "#f1f1f1" }}
        >
          <div className="modal-header">
            <h5 className="modal-title" id="categoryModalLabel">
              Add New Category
            </h5>
            <button
              type="button"
              className="btn-close"
              style={{ filter: "invert(1)" }}
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {/* Category Name */}
            <div className="mb-3">
              <label htmlFor="categoryName" className="form-label">
                Category Name
              </label>
              <input
                type="text"
                id="categoryName"
                className="form-control"
                style={{
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "1px solid #555",
                }}
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>

            {/* File Input */}
            <div className="mb-3">
              <label htmlFor="categoryImage" className="form-label">
                Upload Image
              </label>
              <input
                type="file"
                id="categoryImage"
                className="form-control"
                style={{
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "1px solid #555",
                }}
                onChange={handleFileChange}
              />

              {/* Preview if user selected a file */}
              {previewUrl && (
                <div className="text-center mt-3">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              style={{
                backgroundColor: "#555",
                color: "#fff",
                border: "none",
              }}
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
              }}
              onClick={handleSubmit}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Add Category"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
