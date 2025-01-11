import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import "../../syles/view.css"; // تأكد من أن المسار صحيح

const UPDATE_DEMOGRAPHIC_DATA = gql`
  mutation AddDemographicData(
  $villageId: Int!
  $population: Int!
  $population_distribution: [String!]!
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
    populationSize: currentData?.populationSize || "",
    ageDistribution: currentData?.ageDistribution || "",
    genderRatios: currentData?.genderRatios || "",
    populationGrowthRate: currentData?.populationGrowthRate || "",
  });

  const [updateDemographicData] = useMutation(UPDATE_DEMOGRAPHIC_DATA);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({
      villageId: parseInt(villageId, 10),
      population: parseInt(formData.populationSize, 10),
      population_distribution: JSON.stringify(formData.ageDistribution),
      gender_ratios: JSON.stringify(formData.genderRatios),
      population_growth_rate: parseFloat(formData.populationGrowthRate),
    });
    
    // تحقق من أن البيانات المدخلة صحيحة
    if (!formData.populationSize || isNaN(parseInt(formData.populationSize, 10))) {
      alert("Please enter a valid population size.");
      return;
    }
    if (!formData.populationGrowthRate || isNaN(parseFloat(formData.populationGrowthRate))) {
      alert("Please enter a valid population growth rate.");
      return;
    }
  
    try {
      await updateDemographicData({
        variables: {
          villageId: parseInt(villageId, 10),
          population: parseInt(formData.populationSize, 10),
          population_distribution: formData.ageDistribution, // إرسال النص مباشرة
          gender_ratios: formData.genderRatios,             // إرسال النص مباشرة
          population_growth_rate: parseFloat(formData.populationGrowthRate),
        },
      });
      
      
      
  
      console.log("Demographic data updated!");
      if (refreshVillages) refreshVillages();
      if (onClose) onClose();
    } catch (error) {
      console.error("Error updating demographic data:", error);
      alert("Failed to update demographic data. Please try again.");
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
              type="text"
              name="populationSize"
              required
              value={formData.populationSize}
              onChange={handleChange}
              placeholder="e.g., 5000"
              title="Enter the Population Size of the village"
            />
          </div>

          <label>Age Distribution:</label>
          <div>
            <input
              type="text"
              name="ageDistribution"
              required
              value={formData.ageDistribution}
              onChange={handleChange}
              placeholder="e.g., 0–14: 30%, 15–64: 60%, 65+: 10%"
              title="Enter the Age Distribution of the village"
            />
          </div>

          <label>Gender Ratios:</label>
          <div>
            <input
              type="text"
              name="genderRatios"
              required
              value={formData.genderRatios}
              onChange={handleChange}
              placeholder="e.g., male: 52%, female: 48%"
              title="Enter the Gender Ratios"
            />
          </div>

          <label>Population Growth Rate:</label>
          <div>
            <input
              type="text"
              name="populationGrowthRate"
              required
              value={formData.populationGrowthRate}
              onChange={handleChange}
              placeholder="e.g., 1.5% annually"
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
