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
import AddCategoryModal from "../components/AddCategoryModal";
import EditCategoryModal from "../components/EditCategoryModal";
import CategoryCard from "../components/CategoryCard";

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
    const updatedCategory = {
      name: editingCategory.name,
      image: editingCategory.image,
    };
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
      className="container-fluid text-white mt-5"
      style={{
        backgroundColor: "#0A060D",
        minHeight: "100vh",
        paddingTop: "50px",
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
          <CategoryCard
            key={category.id}
            category={category}
            isAdmin={isAdmin}
            onEdit={() => setEditingCategory(category)}
            onDelete={handleDeleteCategory}
            onClick={handleCategoryClick}
          />
        ))}
      </div>

      <AddCategoryModal
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        onAddCategory={handleAddCategory}
      />

      {editingCategory && (
        <EditCategoryModal
          editingCategory={editingCategory}
          setEditingCategory={setEditingCategory}
          onEditCategory={handleEditCategory}
        />
      )}
    </div>
  );
};

export default Pictures;
