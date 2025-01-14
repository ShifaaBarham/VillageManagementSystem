import React, { useState } from "react";

const CustomDropdown = ({ sortBy, setSortBy }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (value) => {
    setSortBy(value);
    setIsOpen(false);
  };

  return (
    <div className="dp-wrapper">
  <div
    className="dropdown_button"
    onClick={() => setIsOpen((prev) => !prev)} 
  >
    {sortBy === "default" ? "Default" : "Alphabetical"}
    <span className="arrow"> &#x25BC;</span> 
  </div>




      <div className={`dropdown_list ${isOpen ? "active" : ""}`}>
        <div
          className={`dropdown-option ${
            sortBy === "default" ? "selected" : ""
          }`}
          onClick={() => handleOptionClick("default")}
        >
          <span className="checkmark">✔</span> Default
        </div>
        <div
          className={`dropdown-option ${
            sortBy === "alphabetical" ? "selected" : ""
          }`}
          onClick={() => handleOptionClick("alphabetical")}
        >
          <span className="checkmark">✔</span> Alphabetical
        </div>
      </div>
    </div>
  );
};

export default CustomDropdown;
