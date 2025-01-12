import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import "../../syles/view.css";

const ADD_VILLAGE = gql`
  mutation AddVillage(
    $name: String!
    $region: String!
    $land_area: Float!
    $latitude: Float!
    $longitude: Float!
    $image: String
    $tags: [String!]!
  ) {
    addVillage(
      name: $name
      region: $region
      land_area: $land_area
      latitude: $latitude
      longitude: $longitude
      image: $image
      tags: $tags
    ) {
      id
      name
      tags
    }
  }
`;

const AddVillageForm = ({ onClose, refreshVillages }) => {
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    land_area: 0, // القيمة الافتراضية
    latitude: 0,  // القيمة الافتراضية
    longitude: 0, // القيمة الافتراضية
    image: "",
    tags: "",
  });

  const [addVillage] = useMutation(ADD_VILLAGE);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1]; // إزالة header الخاص بـ Base64
        setFormData((prevData) => ({ ...prevData, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // تحويل التاغات إلى مصفوفة
    const parsedTags = formData.tags.includes("[") && formData.tags.includes("]")
      ? JSON.parse(formData.tags)
      : formData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag);
  
    try {
      await addVillage({
        variables: {
          name: formData.name.trim(),
          region: formData.region.trim(),
          land_area: parseFloat(formData.land_area),
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          image: formData.image || null,
          tags: parsedTags.length > 0 ? parsedTags : ["general"],
        },
      });
  
      alert("Village added successfully!");
      refreshVillages();
      onClose();
    } catch (error) {
      console.error("Error adding village:", error);
      alert("Failed to add village. Please check your input or try again later.");
    }
  };
  
  
  return (
    <div className="ov overlay">
      <div className="form1">
        <form onSubmit={handleSubmit}>
          <button type="button" className="close" onClick={onClose} title="Close">
            x
          </button>
          <h2>Add New Village</h2>

          <label>Village Name:</label>
          <div>
            <input
              type="text"
              name="name"
              required
              title="Enter the name of the village"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <label>Region/District:</label>
          <div>
            <input
              type="text"
              name="region"
              required
              title="Enter the region or district of the village"
              value={formData.region}
              onChange={handleChange}
            />
          </div>

          <label>Land Area (sq km):</label>
          <div>
            <input
              type="number"
              name="land_area"
              required
              title="Enter the land area in square km"
              step="0.01"
              min="0"
              value={formData.land_area}
              onChange={handleChange}
            />
          </div>

          <label>Latitude:</label>
          <div>
            <input
              type="number"
              name="latitude"
              required
              title="Enter the latitude (value between -90 and 90)"
              step="0.000001"
              min="-90"
              max="90"
              value={formData.latitude}
              onChange={handleChange}
            />
          </div>

          <label>Longitude:</label>
          <div>
            <input
              type="number"
              name="longitude"
              required
              title="Enter the longitude (value between -180 and 180)"
              step="0.000001"
              min="-180"
              max="180"
              value={formData.longitude}
              onChange={handleChange}
            />
          </div>

          <label>Upload Image:</label>
          <div>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <label>Categories/Tags:</label>
          <div>
            <input
              type="text"
              name="tags"
              required
              placeholder="e.g., rural, urban"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>

          <div>
            <button type="submit">Add Village</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVillageForm;
