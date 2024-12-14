import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Pictures = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", image: "" });
  const [editingCategory, setEditingCategory] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categoriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesData);
    };

    fetchCategories();

    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.image) {
      alert("Please provide both a name and an image URL for the category.");
      return;
    }

    await addDoc(collection(db, "categories"), {
      name: newCategory.name,
      image: newCategory.image,
    });

    alert("Category added!");
    window.location.reload();
  };

  const handleEditCategory = async (id) => {
    const updatedCategory = { name: editingCategory.name, image: editingCategory.image };
    await updateDoc(doc(db, "categories", id), updatedCategory);

    alert("Category updated!");
    window.location.reload();
  };

  const handleDeleteCategory = async (id) => {
    await deleteDoc(doc(db, "categories", id));
    alert("Category deleted!");
    window.location.reload();
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/pictures/${categoryId}`);
  };

  return (
    <div
      className="container-fluid text-white"
      style={{
        backgroundColor: "#0A060D", // Background color
        padding: "40px 0",
        minHeight: "100vh",
      }}
    >
      <h1 className="text-center mb-5" style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
        Image Categories
      </h1>

      {isAdmin && (
        <div className="mb-4 text-center">
          <button
            className="btn btn-primary rounded-pill px-4 py-2"
            data-bs-toggle="modal"
            data-bs-target="#categoryModal"
          >
            Manage Categories
          </button>
        </div>
      )}

      <div className="row">
        {categories.map((category) => (
          <div
            className="col-12 col-md-6 col-lg-4 mb-4"
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            style={{ cursor: "pointer" }}
          >
            <div
              className="card bg-dark text-white shadow"
              style={{ borderRadius: "15px", overflow: "hidden" }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="card-img"
                style={{ objectFit: "cover", height: "200px" }}
              />
              <div className="card-img-overlay d-flex justify-content-between align-items-end p-3">
                <h5 className="card-title bg-black bg-opacity-75 px-2 py-1 rounded">
                  {category.name}
                </h5>
                {isAdmin && (
                  <div>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCategory(category);
                      }}
                      data-bs-toggle="modal"
                      data-bs-target="#editModal"
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      <div
        className="modal fade"
        id="categoryModal"
        tabIndex="-1"
        aria-labelledby="categoryModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="categoryModalLabel">
                Add New Category
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
                <label htmlFor="categoryName" className="form-label">
                  Category Name
                </label>
                <input
                  type="text"
                  id="categoryName"
                  className="form-control"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label htmlFor="categoryImage" className="form-label">
                  Category Image URL
                </label>
                <input
                  type="text"
                  id="categoryImage"
                  className="form-control"
                  value={newCategory.image}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, image: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddCategory}
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
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
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => handleEditCategory(editingCategory.id)}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pictures;
