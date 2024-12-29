import React, { useState } from "react";

const AddVillageForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    landArea: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedVillages = JSON.parse(localStorage.getItem("villages")) || [];
    storedVillages.push(formData);
    localStorage.setItem("villages", JSON.stringify(storedVillages));
    onClose();
  };

  return (
    <div className="ov">
      <form onSubmit={handleSubmit}>
        <button type="button" className="close" onClick={onClose}>
          x
        </button>
        <h2>Add New Village</h2>
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
        <button type="submit">Add Village</button>
      </form>
    </div>
  );
};

export default AddVillageForm;
