import React from "react";

const ViewVillageForm = ({ village, onClose }) => {
  return (
    <div className="ov ov2">
      <form>
        <button type="button" className="close" onClick={onClose}>
          x
        </button>
        <h2>Village Details</h2>
        <label>Village Name: {village.name}</label>
        <label>Region/District: {village.region}</label>
        <label>Land Area (sq km): {village.landArea}</label>
        <label>Latitude: {village.latitude}</label>
        <label>Longitude: {village.longitude}</label>
        <label>Image:</label>
        <img
          className="current-image"
          src={village.image || "./default-image.jpg"}
          alt="Village"
          style={{ width: "100px", height: "auto" }}
        />
      </form>
    </div>
  );
};

export default ViewVillageForm;
