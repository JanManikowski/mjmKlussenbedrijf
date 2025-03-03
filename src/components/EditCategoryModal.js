import React, { useState, useEffect } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";

const EditCategoryModal = ({ editingCategory, setEditingCategory, onEditCategory }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // When editingCategory changes, update previewUrl to current image and reset selected file
  useEffect(() => {
    setPreviewUrl(editingCategory.image);
    setSelectedFile(null);
  }, [editingCategory]);

  // When a new file is selected, store it and generate a preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // When Save Changes is clicked, if a new file was selected, upload it first.
  const handleSaveChanges = async () => {
    let newImageUrl = editingCategory.image; // default to current image
    if (selectedFile) {
      try {
        const storage = getStorage();
        // Use a unique path; here we prefix with the category id
        const storageRef = ref(storage, `categories/${editingCategory.id}-${selectedFile.name}`);
        await uploadBytes(storageRef, selectedFile);
        newImageUrl = await getDownloadURL(storageRef);
      } catch (error) {
        console.error("Error uploading new image:", error);
        toast.error("Failed to upload new image.");
        return;
      }
    }

    // Create an updated category object with new image URL and name
    const updatedCategory = {
      ...editingCategory,
      image: newImageUrl,
    };

    // Update the parent's Firestore document with the new data
    await onEditCategory(updatedCategory.id, updatedCategory);
  };

  return (
    <div
      className="modal fade"
      id="editModal"
      tabIndex="-1"
      aria-labelledby="editModalLabel"
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
            <h5 className="modal-title" id="editModalLabel">
              Edit Category
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
              <label htmlFor="editCategoryName" className="form-label">
                Category Name
              </label>
              <input
                type="text"
                id="editCategoryName"
                className="form-control"
                style={{
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "1px solid #555",
                }}
                value={editingCategory.name}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    name: e.target.value,
                  })
                }
              />
            </div>

            {/* Image Preview and File Input */}
            <div className="mb-3">
              <label className="form-label">Image Preview</label>
              <div className="text-center mb-2">
                <img
                  src={previewUrl}
                  alt="Category Preview"
                  style={{
                    maxWidth: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              </div>
              <label htmlFor="editCategoryNewImage" className="form-label">
                Change Image
              </label>
              <input
                type="file"
                id="editCategoryNewImage"
                className="form-control"
                style={{
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "1px solid #555",
                }}
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              style={{ backgroundColor: "#555", color: "#fff", border: "none" }}
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-warning"
              style={{ backgroundColor: "#ffc107", color: "#000", border: "none" }}
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModal;
