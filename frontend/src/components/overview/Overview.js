import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { PopulationChart, GenderRatioChart, AgeDistributionChart } from './Charts';
import styles from '../../syles/MainSection.module.css'; 
import MapComponent from './MapComponent';
const GET_VILLAGES = gql`
  query GetVillages {
    villages {
      id
      name
      region
      land_area
      latitude
      longitude
      image
      tags
      population
      population_distribution
      gender_ratios
      population_growth_rate
    }
  }
`;

const MainSection = () => {
  const { loading, error, data } = useQuery(GET_VILLAGES);

  const [villages, setVillages] = useState([]);

  useEffect(() => {
    if (data && data.villages) {
      setVillages(data.villages);
    }
  }, [data]);

  const getTotalVillages = (villages) => villages.length;
  const getTotalUrbanAreas = (villages) => villages.filter(village => village.population > 100000).length; 
  const getTotalPopulation = (villages) => villages.reduce((total, village) => total + village.population, 0);
  const getAverageLandArea = (villages) => {
    const validVillages = villages.filter(village => village.land_area !== null && village.land_area !== undefined);
    
    if (validVillages.length === 0) {
      return 10000; 
    }
  
    const totalArea = validVillages.reduce((total, village) => total + village.land_area, 0);
    return (totalArea / validVillages.length).toFixed(3);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <section id="Overview" className={`${styles.section} ${styles.active}`}>
      <h1>Overview</h1>
      <div id="map-container" className={styles.mapContainer}>
      <MapComponent villages={data.villages} />
      </div>
      <div className={styles.cards}>
        <div className={styles.card} id="total-villages">
          <div className="card-name">Total Number Of Villages</div>
          <div className="number">{getTotalVillages(data.villages)}</div>
        </div>
        <div className={styles.card} id="total-urban">
          <div className="card-name">Total Number Of Urban Areas</div>
          <div className="number">{getTotalUrbanAreas(data.villages)}</div>
        </div>
        <div className={styles.card} id="population">
          <div className="card-name">Total Population</div>
          <div className="number">{getTotalPopulation(data.villages)}</div>
        </div>
        <div className={styles.card} id="area">
          <div className="card-name">Average Land Area</div>
          <div className="number">{getAverageLandArea(data.villages)} km²</div>
          
        </div>
      </div>
      <div className={styles.charts}>
        <div className={styles.chart} id="age-distribution">
          <div className="card-name">Age Distribution</div>
          <AgeDistributionChart villages={data.villages} />
        </div>
        <div className={styles.chart} id="gender-ratios">
          <GenderRatioChart villages={data.villages} />
        </div>
        <div className={styles.chart} id="population-chart">
          <PopulationChart villages={data.villages} />
        </div>
      </div>
    </section>
  );
};

export default MainSection;
