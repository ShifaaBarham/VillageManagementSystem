import React, { useState } from "react";

const UpdateVillageForm = ({ village, onClose }) => {
  const [formData, setFormData] = useState({ ...village });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedVillages = JSON.parse(localStorage.getItem("villages")) || [];
    const updatedVillages = storedVillages.map((v) =>
      v.name === village.name ? formData : v
    );
    localStorage.setItem("villages", JSON.stringify(updatedVillages));
    onClose();
  };

  return (
    <div className="ov ov1">
      <form onSubmit={handleSubmit}>
        <button type="button" className="close" onClick={onClose}>
          x
        </button>
        <h2>Update Village</h2>
        <label>Village Name:</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <label>Region/District:</label>
        <input
          name="region"
          value={formData.region}
          onChange={handleChange}
          required
        />
        <label>Land Area (sq km):</label>
        <input
          name="landArea"
          value={formData.landArea}
          onChange={handleChange}
          required
        />
        <label>Latitude:</label>
        <input
          name="latitude"
          value={formData.latitude}
          onChange={handleChange}
          required
        />
        <label>Longitude:</label>
        <input
          name="longitude"
          value={formData.longitude}
          onChange={handleChange}
          required
        />
        <button type="submit">Update Village</button>
      </form>
    </div>
  );
};

export default UpdateVillageForm;
