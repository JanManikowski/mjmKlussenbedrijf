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
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="editModalLabel">
            Edit Category
          </h5>
          <button
            type="button"
            className="btn-close"
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
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            Close
          </button>
          <button
            type="button"
            className="btn btn-warning"
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
