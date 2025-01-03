import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [images, setImages] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const categoryQuery = query(
          collection(db, "categories"),
          where("__name__", "==", categoryId)
        );
        const categorySnapshot = await getDocs(categoryQuery);
        const category = categorySnapshot.docs[0]?.data();
        setCategoryName(category?.name || "Unknown Category");

        const imageQuery = query(
          collection(db, "images"),
          where("categoryId", "==", categoryId)
        );
        const imageSnapshot = await getDocs(imageQuery);
        const imagesData = imageSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setImages(imagesData);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchCategoryData();

    // Check login status (use actual logic for authentication)
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsLoggedIn(adminStatus);
  }, [categoryId]);

  const handleFilesUpload = async (files) => {
    if (!files.length) {
      alert("Please select files to upload.");
      return;
    }

    setIsUploading(true);

    const uploadPromises = Array.from(files).map(async (file) => {
      const image = new Image();
      const loadPromise = new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          image.src = e.target.result;
          image.onload = () =>
            resolve({ width: image.width, height: image.height });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const dimensions = await loadPromise;

      const storageRef = ref(storage, `images/${categoryId}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => reject(error),
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              await addDoc(collection(db, "images"), {
                categoryId,
                url: downloadURL,
                width: dimensions.width,
                height: dimensions.height,
                timestamp: serverTimestamp(),
              });
              resolve();
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    });

    try {
      await Promise.all(uploadPromises);
      alert("All files uploaded successfully!");
      setIsUploading(false);
      window.location.reload();
    } catch (error) {
      alert("Some uploads failed. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <div
      className="container-fluid text-white mt-5"
      style={{
        backgroundColor: "#0A060D", // Matches the dark theme
        minHeight: "100vh",
        paddingTop: "40px",
      }}
    >
      <h1
        className="text-center mb-5"
        style={{ fontSize: "2.5rem", fontWeight: "bold" }}
      >
        {categoryName} Images
      </h1>

      {isLoggedIn && ( // Show upload section only if logged in
        <div className="mb-4 text-center">
          <label htmlFor="fileInput" className="form-label">
            <strong>Upload Images</strong>
          </label>
          <input
            type="file"
            id="fileInput"
            className="form-control w-50 mx-auto"
            multiple
            onChange={(e) => handleFilesUpload(e.target.files)}
            style={{
              backgroundColor: "#1a1a1a", // Dark background for input
              color: "#f1f1f1",
              border: "1px solid #555",
            }}
          />
          {isUploading && (
            <p className="text-warning mt-3">
              Uploading images... Please wait.
            </p>
          )}
        </div>
      )}

      <div
        className="gallery-container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(200px, 1fr))",
          gap: "10px", 
          gridAutoFlow: "dense", 
          padding: "2rem",
        }}
      >
        {images.map((image) => (
          <div
            key={image.id}
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "10px",
              gridRowEnd: `span ${Math.ceil(
                (image.height / image.width) * 2
              )}`, // Adjust row span for taller images
              border: "2px solid #333", // Subtle border for images
            }}
          >
            <img
              src={image.url}
              alt="Category"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
