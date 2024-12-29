import React, { useEffect } from "react";
import Chart from "chart.js/auto";

const AgeDistributionChart = ({ villages }) => {
  useEffect(() => {
    const ageRanges = ["0-18", "19-35", "36-50", "51-65", "65+"];
    const totalPopulationByAge = ageRanges.map(range =>
      villages.reduce((sum, village) => {
        const distribution = village.populationDistribution || {};
        return sum + parseInt(distribution[range] || 0);
      }, 0)
    );

    const ctx = document.getElementById("ageChart");
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: ageRanges,
        datasets: [{
          label: "Population Distribution by Age",
          data: totalPopulationByAge,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)"
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)"
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
            text: "Age Distribution"
          }
        }
      }
    });
  }, [villages]);

  return <canvas id="ageChart"></canvas>;
};

export default AgeDistributionChart;
