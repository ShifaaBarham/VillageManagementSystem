import React, { useState, useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import "../../syles/view.css";

// GraphQL Query to get village data by ID
const GET_VILLAGE_BY_ID = gql`
  query GetVillage($id: ID!) {
    village(id: $id) {
      id
      name
      region
      land_area
      latitude
      longitude
      image
    }
  }
`;


// Mutation to update village
const UPDATE_VILLAGE = gql`
  mutation updateVillage(
    $id: ID!
    $name: String!
    $region: String!
    $land_area: Float!
    $latitude: Float!
    $longitude: Float!
    $image: String
  ) {
    updateVillage(
      id: $id
      name: $name
      region: $region
      land_area: $land_area
      latitude: $latitude
      longitude: $longitude
      image: $image
    ) {
      id
      name
      region
      land_area
      latitude
      longitude
      image
    }
  }
`;


const UpdateVillageForm = ({ villageId, onClose, refreshVillages }) => {
  // State to hold form data
  const [formData, setFormData] = useState({});
  const { loading, error, data } = useQuery(GET_VILLAGE_BY_ID, {
    variables: { id: villageId },
  });

  // Mutation hook
  const [updateVillage] = useMutation(UPDATE_VILLAGE);

  // Update formData when data is fetched
  useEffect(() => {
    if (data) {
      setFormData(data.village);
    }
  }, [data]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload and convert to Base64
 const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    setFormData((prevData) => ({
      ...prevData,
      image: reader.result,
    }));
  };
};

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
        await updateVillage({
          variables: {
            id: villageId,
            name: formData.name || "",
            region: formData.region || "",
            land_area: formData.land_area ? parseFloat(formData.land_area) : 0,
            latitude: formData.latitude ? parseFloat(formData.latitude) : 0,
            longitude: formData.longitude ? parseFloat(formData.longitude) : 0,
            image: formData.image || null,
          },
        });
  
      console.log("Village updated successfully!");
      refreshVillages && refreshVillages();
      onClose && onClose();
    } catch (error) {
      console.error("Error updating village:", error);
    }
  };
  
  // Show loading or error
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="ov ov1 overlay">
      <div className="form1">
        <form onSubmit={handleSubmit}>
          <button type="button" className="close" onClick={onClose} title="Close">
            x
          </button>
          <h2>Update Village</h2>

          {/* Name */}
          <label>Village Name:</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name || ""}
            onChange={handleChange}
          />

          {/* Region */}
          <label>Region/District:</label>
          <input
            type="text"
            name="region"
            required
            value={formData.region || ""}
            onChange={handleChange}
          />

          {/* Land Area */}
          <label>Land Area (sq km):</label>
          <input
            type="number"
            name="land_area"
            required
            step="0.01"
            value={formData.land_area || ""}
            onChange={handleChange}
          />

          {/* Latitude */}
          <label>Latitude:</label>
          <input
            type="number"
            name="latitude"
            required
            step="0.000001"
            min="-90"
            max="90"
            value={formData.latitude || ""}
            onChange={handleChange}
          />

          {/* Longitude */}
          <label>Longitude:</label>
          <input
            type="number"
            name="longitude"
            required
            step="0.000001"
            min="-180"
            max="180"
            value={formData.longitude || ""}
            onChange={handleChange}
          />

          {/* Image Upload */}
          <label>Upload Image:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageUpload}
          />

          {/* Submit Button */}
          <button type="submit">Update Village</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateVillageForm;
