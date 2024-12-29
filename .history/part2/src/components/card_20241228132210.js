import React from "react";

const Cards = ({ totalVillages, totalUrban, totalPopulation, avgLandArea }) => (
  <div className="cards">
    <div className="card" id="total-villages">
      <div className="card-name">Total Number Of Villages</div>
      <div className="number">{totalVillages}</div>
    </div>
    <div className="card" id="total-urban">
      <div className="card-name">Total Number Of Urban Areas</div>
      <div className="number">{totalUrban}</div>
    </div>
    <div className="card" id="population">
      <div className="card-name">Total Population</div>
      <div className="number">{totalPopulation}</div>
    </div>
    <div className="card" id="area">
      <div className="card-name">Average Land Area</div>
      <div className="number">{avgLandArea}</div>
      <h4>sq km</h4>
    </div>
  </div>
);

export default Card;
