import React, { useState, useEffect } from "react";

const VillageManagement = ({
  onAddClick,
  onUpdateClick,
  onViewClick,
  onDemographicsClick,
}) => {
  const [villages, setVillages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedVillages = JSON.parse(localStorage.getItem("villages")) || [];
    setVillages(storedVillages);
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredVillages = villages.filter((village) =>
    village.name.toLowerCase().includes(searchQuery)
  );

  return (
    <section className="section">
      <div className="but1">
        <button onClick={onAddClick}>Add New Village</button>
      </div>
      <div className="div1">
        <h4>View Village List</h4>
        <input
          type="text"
          placeholder="Search villages..."
          className="search"
          value={searchQuery}
          onChange={handleSearch}
        />
        <div className="container">
          <label>Sort by:</label>
          <div className="dp-wrapper">
            <button id="dropdownbutton" className="dropdown_button">
              Default
              <span className="arrow"> &#9662;</span>
            </button>
          </div>
          <div className="pag">
            <label>Page:</label>
            <button className="prev-next" disabled>
              Prev
            </button>
            <span>1 / 1</span>
            <button className="prev-next" disabled>
              Next
            </button>
          </div>
        </div>
        <div className="village-items">
          {filteredVillages.map((village, index) => (
            <div key={index} className="item">
              <label>
                {village.name} - {village.region}
              </label>
              <button onClick={() => onViewClick(village)}>View</button>
              <button onClick={() => onUpdateClick(village)}>Update Village</button>
              <button onClick={() => onDemographicsClick(village)}>
                Add Demographic Data
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VillageManagement;
