import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import "../../syles/view.css"

const UPDATE_VILLAGE = gql`
  mutation UpdateVillage(
    $id: ID!
    $name: String
    $region: String
    $landArea: Float
    $latitude: Float
    $longitude: Float
    $image: String
    $tags: String
    $population: Int
    $populationDistribution: JSON
    $genderRatios: JSON
    $populationGrowthRate: Float
  ) {
    updateVillage(
      id: $id
      name: $name
      region: $region
      land_area: $landArea
      latitude: $latitude
      longitude: $longitude
      image: $image
      tags: $tags
      population: $population
      population_distribution: $populationDistribution
      gender_ratios: $genderRatios
      population_growth_rate: $populationGrowthRate
    ) {
      id
      name
    }
  }
`;

const UpdateVillageForm = ({ villageId, currentData, onClose, refreshVillages }) => {
  const [formData, setFormData] = useState(currentData || {});
  const [updateVillage] = useMutation(UPDATE_VILLAGE);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateVillage({
        variables: {
          id: villageId,
          ...formData,
          landArea: parseFloat(formData.landArea),
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          population: parseInt(formData.population, 10),
          populationDistribution: JSON.parse(formData.populationDistribution),
          genderRatios: JSON.parse(formData.genderRatios),
          populationGrowthRate: parseFloat(formData.populationGrowthRate),
        },
      });
      console.log("Village updated!");
      refreshVillages && refreshVillages();
      onClose && onClose();
    } catch (error) {
      console.error("Error updating village:", error);
    }
  };

  return (
    <div className="ov ov1 overlay">
      <div className="form1">
        <form onSubmit={handleSubmit}>
          <button type="button" className="close" onClick={onClose} title="Close">
            x
          </button>
          <h2>Update Village</h2>

          <label>Village Name:</label>
          <div>
            <input
              type="text"
              name="name"
              required
              title="Update the name of the village"
              value={formData.name || ""}
              onChange={handleChange}
            />
          </div>

          <label>Region/District:</label>
          <div>
            <input
              type="text"
              name="region"
              required
              title="Update the region or district of the village"
              value={formData.region || ""}
              onChange={handleChange}
            />
          </div>

          <label>Land Area (sq km):</label>
          <div>
            <input
              type="text"
              name="landArea"
              required
              title="Update the land Area in square km"
              step="0.01"
              min="0"
              value={formData.landArea || ""}
              onChange={handleChange}
            />
          </div>

          <label>Latitude:</label>
          <div>
            <input
              type="number"
              name="latitude"
              required
              title="Update the Latitude (value between -90 and 90)"
              step="0.000001"
              min="-90"
              max="90"
              value={formData.latitude || ""}
              onChange={handleChange}
            />
          </div>

          <label>Longitude:</label>
          <div>
            <input
              type="number"
              name="longitude"
              required
              title="Update the Longitude (value between -180 and 180)"
              step="0.000001"
              min="-180"
              max="180"
              value={formData.longitude || ""}
              onChange={handleChange}
            />
          </div>

          <label>Upload Image:</label>
          <div>
            <input
              type="file"
              name="image"
              required
              title="Upload an image file representing the village"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
          <button type="submit">Update Village</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateVillageForm;
