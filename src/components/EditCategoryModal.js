import React from "react";

const EditCategoryModal = ({ editingCategory, setEditingCategory, onEditCategory }) => (
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
          backgroundColor: "#1a1a1a", // Dark background
          color: "#f1f1f1", // Light text
        }}
      >
        <div className="modal-header">
          <h5 className="modal-title" id="editModalLabel">
            Edit Category
          </h5>
          <button
            type="button"
            className="btn-close"
            style={{ filter: "invert(1)" }} // Light-themed close button
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
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
          <div className="mb-3">
            <label htmlFor="editCategoryImage" className="form-label">
              Category Image URL
            </label>
            <input
              type="text"
              id="editCategoryImage"
              className="form-control"
              style={{
                backgroundColor: "#333",
                color: "#fff",
                border: "1px solid #555",
              }}
              value={editingCategory.image}
              onChange={(e) =>
                setEditingCategory({
                  ...editingCategory,
                  image: e.target.value,
                })
              }
            />
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
            className="btn btn-warning"
            style={{
              backgroundColor: "#ffc107",
              color: "#000",
              border: "none",
            }}
            onClick={() => onEditCategory(editingCategory.id)}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default EditCategoryModal;
