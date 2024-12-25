import React, { useEffect, useState } from "react";
import { collection, query, getDocs, limit, where } from "firebase/firestore";
import { db } from "../firebase";

const CACHE_KEY = "category_gallery_images"; // Cache key for localStorage
const CACHE_EXPIRATION = 1000 * 60 * 5; // Cache expiration time in milliseconds (5 minutes)

const CategoryGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAndCacheImages = async () => {
    try {
      const categoriesQuery = query(collection(db, "categories"));
      const categorySnapshot = await getDocs(categoriesQuery);

      const categories = categorySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (categories.length === 0) {
        setImages([]);
        setLoading(false);
        return;
      }

      const maxImages = 10;
      const validImagePromises = categories.map(async (category) => {
        const imagesQuery = query(
          collection(db, "images"),
          where("categoryId", "==", category.id),
          limit(maxImages)
        );
        const imageSnapshot = await getDocs(imagesQuery);

        return {
          categoryId: category.id,
          images: imageSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
        };
      });

      const categoryImageResults = await Promise.all(validImagePromises);

      const nonEmptyCategories = categoryImageResults.filter(
        (result) => result.images.length > 0
      );

      if (nonEmptyCategories.length === 0) {
        setImages([]);
        setLoading(false);
        return;
      }

      const imagesPerCategory = Math.max(
        Math.floor(maxImages / nonEmptyCategories.length),
        1
      );

      const distributedImages = nonEmptyCategories.flatMap((result) =>
        result.images.slice(0, imagesPerCategory)
      );

      const finalImages = distributedImages.slice(0, maxImages);

      // Save to cache
      const cacheData = {
        timestamp: Date.now(),
        data: finalImages,
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

      setImages(finalImages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedData = localStorage.getItem(CACHE_KEY);

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);

      // Check cache expiration
      if (Date.now() - parsedData.timestamp < CACHE_EXPIRATION) {
        setImages(parsedData.data);
        setLoading(false);
        return;
      }
    }

    // Fetch and cache images if no valid cache is found
    fetchAndCacheImages();
  }, []);

  if (loading) {
    return <p className="text-center text-white">Loading images...</p>;
  }

  if (images.length === 0) {
    return <p className="text-center text-white">No images available.</p>;
  }

  return (
    <div
      className="gallery-container"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(200px, 1fr))",
        gap: "10px",
        gridAutoFlow: "dense",
        padding: "20px",
        backgroundColor: "#0A060D",
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
            )}`,
            border: "2px solid #333",
          }}
        >
          <img
            src={image.url}
            alt={`Category ${image.categoryId}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default CategoryGallery;
