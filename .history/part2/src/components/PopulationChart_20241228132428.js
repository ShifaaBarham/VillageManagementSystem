import React, { useEffect } from "react";
import Chart from "chart.js/auto";

const PopulationChart = ({ villages }) => {
  useEffect(() => {
    const population = villages.map(village => parseInt(village.population || 0));
    const villageNames = villages.map(village => village.name);

    const ctx = document.getElementById("populationChart");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: villageNames,
        datasets: [{
          label: "Population",
          data: population,
          backgroundColor: "#445c64",
          borderColor: "#69b5b5",
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }, [villages]);

  return <canvas id="populationChart"></canvas>;
};

export default PopulationChart;
