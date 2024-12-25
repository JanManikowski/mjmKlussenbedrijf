import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AddCategoryModal = ({ newCategory, setNewCategory, onAddCategory }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image to upload.");
      return;
    }

    setUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `categories/${selectedFile.name}`);
      await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(storageRef);
      setNewCategory({ ...newCategory, image: downloadURL });
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload the image. Please try again.");
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
          style={{
            backgroundColor: "#1a1a1a",
            color: "#f1f1f1",
          }}
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
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
              />
            </div>
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
              {selectedFile && (
                <button
                  type="button"
                  className="btn btn-secondary mt-2"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload Image"}
                </button>
              )}
            </div>
            {newCategory.image && (
              <div className="text-center mt-3">
                <img
                  src={newCategory.image}
                  alt="Uploaded Preview"
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
              onClick={onAddCategory}
              disabled={!newCategory.image || uploading}
            >
              Add Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
