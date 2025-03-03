import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../firebase";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [images, setImages] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // Get the category details using its document ID
        const categoryQuery = query(
          collection(db, "categories"),
          where("__name__", "==", categoryId)
        );
        const categorySnapshot = await getDocs(categoryQuery);
        const category = categorySnapshot.docs[0]?.data();
        setCategoryName(category?.name || "Unknown Category");

        // Get all images for this category
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
                fileName: file.name,
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

  const handleDeleteImage = async (image) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      // Delete Firestore document
      await deleteDoc(doc(db, "images", image.id));

      // Determine fileName: if missing, extract it from the URL
      let fileName = image.fileName;
      if (!fileName) {
        const decodedUrl = decodeURIComponent(image.url);
        const parts = decodedUrl.split("/");
        const lastPart = parts[parts.length - 1];
        fileName = lastPart.split("?")[0];
      }

      if (fileName) {
        const imageRef = ref(storage, `images/${categoryId}/${fileName}`);
        await deleteObject(imageRef);
        console.log(`Deleted from storage: ${fileName}`);
      } else {
        console.warn("Unable to determine fileName, skipping storage deletion.");
      }
      alert("Image deleted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Check console for details.");
    }
  };

  return (
    <div
      className="container-fluid text-white mt-5"
      style={{
        backgroundColor: "#0A060D",
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

      {isLoggedIn && (
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
              backgroundColor: "#1a1a1a",
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

      {/* Wrap the gallery in a container with a larger maxWidth */}
      <div style={{ maxWidth: "70%", margin: "0 auto" }}>
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
                // Compute gridRowEnd to adjust for image aspect ratio:
                gridRowEnd: `span ${Math.ceil((image.height / image.width) * 2)}`,
                border: "2px solid #333",
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
              {isLoggedIn && (
                <button
                  onClick={() => handleDeleteImage(image)}
                  className="btn btn-danger btn-sm"
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    zIndex: 1000,
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
