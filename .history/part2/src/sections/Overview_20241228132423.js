import React, { useState, useEffect } from "react";
import MapComponent from "../components/Map";
import CardsComponent from "../components/Card";
import ChartsComponent from "./Chart";
import "../styles/mainSection.css";

const Overview = () => {
  const [villages, setVillages] = useState([]);
  const [stats, setStats] = useState({
    totalVillages: 0,
    totalUrban: 0,
    totalPopulation: 0,
    avgLandArea: 0,
  });
  const [chartData, setChartData] = useState({
    populationData: null,
    ageData: null,
    genderData: null,
  });

  useEffect(() => {
    const rawData = localStorage.getItem("villages");
    if (rawData) {
      const parsedData = JSON.parse(rawData);
      setVillages(parsedData);

      // حساب الإحصائيات
      const totalVillages = parsedData.length;
      const totalPopulation = parsedData.reduce((sum, v) => sum + (v.population || 0), 0);
      const avgLandArea = totalVillages ? (parsedData.reduce((sum, v) => sum + (v.landArea || 0), 0) / totalVillages).toFixed(2) : 0;

      setStats({ totalVillages, totalUrban: 0, totalPopulation, avgLandArea });

      // إعداد بيانات الرسوم البيانية
      const populationData = {
        labels: parsedData.map((v) => v.name),
        datasets: [{ label: "Population", data: parsedData.map((v) => v.population), backgroundColor: "#445c64" }],
      };
      const ageData = {
        labels: ["0-18", "19-35", "36-50", "51-65", "65+"],
        datasets: [{ data: [10, 20, 30, 25, 15], backgroundColor: ["red", "blue", "green", "yellow", "purple"] }],
      };
      const genderData = {
        labels: ["Male", "Female"],
        datasets: [{ data: [60, 40], backgroundColor: ["blue", "pink"] }],
      };

      setChartData({ populationData, ageData, genderData });
    }
  }, []);

  return (
    <section id="Overview" className="section active">
      <h1>Overview</h1>
      <MapComponent villages={villages} />
      <CardsComponent {...stats} />
      <ChartsComponent {...chartData} />
    </section>
  );
};

export default Overview;
