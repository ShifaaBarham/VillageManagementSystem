import React, { useState } from "react";

const DemographicDataForm = ({ village, onClose }) => {
  const [formData, setFormData] = useState({
    populationSize: "",
    ageDistribution: "",
    genderRatios: "",
    populationGrowthRate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedVillages = JSON.parse(localStorage.getItem("villages")) || [];
    const updatedVillages = storedVillages.map((v) =>
      v.name === village.name ? { ...v, demographicData: formData } : v
    );
    localStorage.setItem("villages", JSON.stringify(updatedVillages));
    onClose();
    alert(`Demographic data added for ${village.name}`);
  };

  return (
    <div className="ov ov3">
      <form onSubmit={handleSubmit}>
        <button type="button" className="close" onClick={onClose}>
          x
        </button>
        <h2>Add Demographic Data for {village.name}</h2>
        <label>Population Size:</label>
        <input
          name="populationSize"
          value={formData.populationSize}
          onChange={handleChange}
          required
        />
        <label>Age Distribution:</label>
        <input
          name="ageDistribution"
          value={formData.ageDistribution}
          onChange={handleChange}
          placeholder="e.g., 0–14: 30%, 15–64: 60%, 65+: 10%"
          required
        />
        <label>Gender Ratios:</label>
        <input
          name="genderRatios"
          value={formData.genderRatios}
          onChange={handleChange}
          required
        />
        <label>Population Growth Rate:</label>
        <input
          name="populationGrowthRate"
          value={formData.populationGrowthRate}
          onChange={handleChange}
          placeholder="e.g., 1.5% annually"
          required
        />
        <button type="submit">Add Demographic Data</button>
      </form>
    </div>
  );
};

export default DemographicDataForm;
