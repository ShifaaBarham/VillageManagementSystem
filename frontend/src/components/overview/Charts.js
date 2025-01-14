import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
const COLORS = ["#0088FE", "#FF8042", "#FFBB28", "#FF8042", "#0088FE"];

const barColors = {
  backgroundColor: "#445c64",
  borderColor: "#69b5b5",
};

const pieColors = [
  "rgba(255, 99, 132, 0.6)",
  "rgba(54, 162, 235, 0.6)",
  "rgba(255, 206, 86, 0.6)",
  "rgba(75, 192, 192, 0.6)",
  "rgba(153, 102, 255, 0.6)",
];

export const PopulationChart = ({ villages }) => {
  const chartData = villages.map((village) => ({
    name: village.name,
    population: parseInt(village.population || 0),
  }));

  return (
    <div style={{ marginBottom: "30px" }}>
      
      <h4>Population Chart</h4>
      <BarChart width={400} height={200} data={chartData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="population" fill={barColors.backgroundColor} />
</BarChart>

    </div>
  );
};
export const AgeDistributionChart = ({ villages }) => {
  const ageRanges = ["0-18", "19-35", "36-50", "51-65", "65+"];

  const totalPopulationByAge = ageRanges.map((range) =>
    villages.reduce((sum, village) => {
      try {
        const distribution = JSON.parse(village.population_distribution || "{}");
        return sum + (distribution[range] || 0);
      } catch (e) {
        console.error("Invalid population distribution", e);
        return sum;
      }
    }, 0)
  );

  const chartData = ageRanges.map((range, index) => ({
    name: range,
    value: totalPopulationByAge[index],
  }));

  return (
    <div style={{ marginBottom: "30px" }}>
      <PieChart width={250} height={250}>
  <Pie
    data={chartData}
    dataKey="value"
    nameKey="name"
    cx="50%"
    cy="50%"
    outerRadius={70}
    label
  >
    {chartData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={pieColors[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip />
  <Legend />
</PieChart>

    </div>
  );
};

export const GenderRatioChart = ({ villages }) => {
  let totalMalePopulation = 0;
  let totalFemalePopulation = 0;

  villages.forEach((village) => {
    try {
      const genderRatio = JSON.parse(village.gender_ratios || "{}");
      const maleRatio = parseInt(genderRatio.male || 0) / 100;
      const femaleRatio = parseInt(genderRatio.female || 0) / 100;

      totalMalePopulation += Math.round(village.population * maleRatio);
      totalFemalePopulation += Math.round(village.population * femaleRatio);
    } catch (e) {
      console.error("Invalid gender ratios", e);
    }
  });

  const chartData = [
    { name: "Male", value: totalMalePopulation },
    { name: "Female", value: totalFemalePopulation },
  ];

  return (
    <div style={{ marginBottom: "30px" }}>
     <div className="card-name">Gender Ratios</div>
      
      <PieChart width={250} height={250}>
  <Pie
    data={chartData}
    dataKey="value"
    nameKey="name"
    cx="50%"
    cy="50%"
    outerRadius={70}
    label
  >
    {chartData.map((entry, index) => (
      <Cell
        key={`cell-${index}`}
        fill={index === 0 ? "rgba(54, 162, 235, 0.6)" : "rgba(255, 99, 132, 0.6)"}
      />
    ))}
  </Pie>
  <Tooltip />
  <Legend />
</PieChart>

    </div>
  );
};
