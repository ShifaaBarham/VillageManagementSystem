import React, { useEffect } from "react";
import Chart from "chart.js/auto";

const GenderRatioChart = ({ villages }) => {
  useEffect(() => {
    let totalMalePopulation = 0;
    let totalFemalePopulation = 0;

    villages.forEach(village => {
      const genderRatio = village.genderRatio || {};
      const maleRatio = parseInt(genderRatio.male || 0) / 100;
      const femaleRatio = parseInt(genderRatio.female || 0) / 100;

      totalMalePopulation += Math.round(village.population * maleRatio);
      totalFemalePopulation += Math.round(village.population * femaleRatio);
    });

    const ctxGender = document.getElementById("genderChart");
    new Chart(ctxGender, {
      type: "pie",
      data: {
        labels: ["Male", "Female"],
        datasets: [{
          label: "Population by Gender",
          data: [totalMalePopulation, totalFemalePopulation],
          backgroundColor: [
            "rgba(54, 162, 235, 0.6)", // Male
            "rgba(255, 99, 132, 0.6)" // Female
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)", // Male
            "rgba(255, 99, 132, 1)" // Female
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: {
            display: true,
            text: "Gender Ratios"
          }
        }
      }
    });
  }, [villages]);

  return <canvas id="genderChart"></canvas>;
};

export default GenderRatioChart;
