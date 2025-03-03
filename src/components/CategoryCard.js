import React from "react";

const CategoryCard = ({ category, isAdmin, onEdit, onDelete, onClick }) => (

  <div
    className="col-12 col-md-6 col-lg-4 mb-4"
    style={{ cursor: "pointer" }}
    onClick={() => onClick(category.id)}
  >
    <div
      className="card bg-dark text-white shadow"
      style={{
        position: "relative",
        borderRadius: "15px",
        overflow: "hidden",
        aspectRatio: "1 / 1", // Forces the card to be a square
      }}
    >
      {/* 
        Instead of .card-img, we manually set width/height to fill the square.
        objectFit: "cover" keeps the image cropped without distortion.
      */}
      <img
        src={category.image}
        alt={category.name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
      
      {/* 
        Absolutely-positioned overlay to show title & buttons at the bottom.
      */}
      <div
        className="card-img-overlay d-flex justify-content-between align-items-end p-3"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <h5 className="card-title bg-black bg-opacity-75 px-2 py-1 rounded">
          {category.name}
        </h5>
        {isAdmin && (
          <div>
            <button
              className="btn btn-warning btn-sm me-2"
              data-bs-toggle="modal"
              data-bs-target="#editModal"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              Edit
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(category.id);
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default CategoryCard;
