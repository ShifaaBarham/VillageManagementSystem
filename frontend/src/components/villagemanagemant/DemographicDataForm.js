import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import "../../syles/view.css";

const UPDATE_DEMOGRAPHIC_DATA = gql`
  mutation AddDemographicData(
    $villageId: Int!
    $population: Int!
    $population_distribution: JSON!
    $gender_ratios: JSON!
    $population_growth_rate: Float!
  ) {
    addDemographicData(
      villageId: $villageId
      population: $population
      population_distribution: $population_distribution
      gender_ratios: $gender_ratios
      population_growth_rate: $population_growth_rate
    ) {
      id
      population
      population_distribution
      gender_ratios
      population_growth_rate
    }
  }
`;

const DemographicDataForm = ({ villageId, currentData, onClose, refreshVillages }) => {
  const [formData, setFormData] = useState({
    populationSize: currentData?.population || "",
    ageDistribution: JSON.stringify(currentData?.population_distribution || {}),
    genderRatios: JSON.stringify(currentData?.gender_ratios || {}),
    populationGrowthRate: currentData?.population_growth_rate || "",
  });

  const [updateDemographicData] = useMutation(UPDATE_DEMOGRAPHIC_DATA);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const parsedAgeDistribution = JSON.parse(formData.ageDistribution);
      const parsedGenderRatios = JSON.parse(formData.genderRatios);

      await updateDemographicData({
        variables: {
          villageId: parseInt(villageId, 10),
          population: parseInt(formData.populationSize, 10),
          population_distribution: parsedAgeDistribution,
          gender_ratios: parsedGenderRatios,
          population_growth_rate: parseFloat(formData.populationGrowthRate),
        },
      });

      console.log("Demographic data updated!");
      if (refreshVillages) refreshVillages();
      if (onClose) onClose();
    } catch (error) {
      console.error("Error updating demographic data:", error);
      alert("Failed to update demographic data. Please make sure the data is correctly formatted.");
    }
  };

  return (
    <div className="ov ov3 overlay">
      <div className="form1">
        <form onSubmit={handleSubmit}>
          <button type="button" className="close" onClick={onClose} title="Close">
            x
          </button>
          <h2>Add Demographic Data for Village</h2>

          <label>Population Size:</label>
          <div>
            <input
              type="number"
              name="populationSize"
              required
              value={formData.populationSize}
              onChange={handleChange}
              placeholder="e.g., 5000"
              title="Enter the Population Size of the village"
            />
          </div>

          <label>Age Distribution (JSON format):</label>
          <div>
            <input
              name="ageDistribution"
              required
              value={formData.ageDistribution}
              onChange={handleChange}
              placeholder='{"0–14": 30, "15–64": 60, "65+": 10}'
              title="Enter the Age Distribution of the village in JSON format"
            />
          </div>

          <label>Gender Ratios (JSON format):</label>
          <div>
            <input
              name="genderRatios"
              required
              value={formData.genderRatios}
              onChange={handleChange}
              placeholder='{"male": 52, "female": 48}'
              title="Enter the Gender Ratios in JSON format"
            />
          </div>

          <label>Population Growth Rate (%):</label>
          <div>
            <input
              type="number"
              step="0.01"
              name="populationGrowthRate"
              required
              value={formData.populationGrowthRate}
              onChange={handleChange}
              placeholder="e.g., 1.5"
              title="Enter the Population Growth Rate"
            />
          </div>

          <div>
            <button type="submit">Add Demographic Data</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DemographicDataForm;
