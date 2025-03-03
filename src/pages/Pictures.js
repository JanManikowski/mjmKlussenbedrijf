import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import AddCategoryModal from "../components/AddCategoryModal";
import EditCategoryModal from "../components/EditCategoryModal";
import CategoryCard from "../components/CategoryCard";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../firebase";

// OPTIONAL: Toast notifications
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Pictures = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoriesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();

    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
  }, []);

  // Function to add a category (unchanged)
  const handleAddCategory = async ({ name, image }) => {
    if (!name || !image) {
      toast.error("Please provide both a name and an image for the category.");
      return;
    }

    try {
      await addDoc(collection(db, "categories"), { name, image });
      toast.success("Category added successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category. Check console for details.");
    }
  };

  // Function to edit a category (unchanged)
  const handleEditCategory = async (id, updatedCategory) => {
    try {
      await updateDoc(doc(db, "categories", id), {
        name: updatedCategory.name,
        image: updatedCategory.image,
      });
      toast.success("Category updated!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category. Check console for details.");
    }
  };

  // Updated function to delete a category and all its associated images
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category and all its data?")) {
      return;
    }
  
    try {
      // 1. Get the category doc
      const categoryRef = doc(db, "categories", id);
      const categorySnap = await getDoc(categoryRef);
      const categoryData = categorySnap.data();
  
      // 2. If category has a main image, delete it from Storage
      if (categoryData?.image) {
        let fileName = null;
        // If you store a "fileName" field directly in the doc, you can do:
        // fileName = categoryData.fileName;
        // Otherwise parse from the 'image' URL:
        const decodedUrl = decodeURIComponent(categoryData.image);
        const parts = decodedUrl.split("/");
        const lastPart = parts[parts.length - 1]; // e.g. "band1.jpg?alt=media..."
        fileName = lastPart.split("?")[0];        // "band1.jpg"
  
        if (fileName) {
          // Adjust folder name if you store it differently
          const catImageRef = ref(storage, `categories/${fileName}`);
          await deleteObject(catImageRef);
          console.log("Deleted category main image from storage:", fileName);
        }
      }
  
      // 3. Delete all images in the subcollection
      const imagesQuery = query(collection(db, "images"), where("categoryId", "==", id));
      const imageSnapshot = await getDocs(imagesQuery);
  
      const deletionPromises = imageSnapshot.docs.map(async (docSnap) => {
        const imageData = { id: docSnap.id, ...docSnap.data() };
  
        // Delete Firestore document for this image
        await deleteDoc(doc(db, "images", imageData.id));
  
        // If we stored "fileName" in the image doc, use it:
        let fileName = imageData.fileName;
        // Otherwise parse from 'url' as fallback
        if (!fileName) {
          const decodedUrl = decodeURIComponent(imageData.url);
          const parts = decodedUrl.split("/");
          const lastPart = parts[parts.length - 1];
          fileName = lastPart.split("?")[0];
        }
  
        if (fileName) {
          const imageRef = ref(storage, `images/${id}/${fileName}`);
          await deleteObject(imageRef);
          console.log("Deleted subcollection image from storage:", fileName);
        }
      });
  
      await Promise.all(deletionPromises);
  
      // 4. Finally, delete the category doc
      await deleteDoc(categoryRef);
  
      toast.success("Category and all its images deleted!");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting category and its images:", error);
      toast.error("Failed to delete category. Check console for details.");
    }
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
      <h1
        className="text-center mb-5"
        style={{ fontSize: "2.5rem", fontWeight: "bold" }}
      >
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

      <AddCategoryModal onAddCategory={handleAddCategory} />

      <EditCategoryModal
        editingCategory={editingCategory || { id: "", name: "", image: "" }}
        setEditingCategory={setEditingCategory}
        onEditCategory={handleEditCategory}
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Pictures;
