import React from "react";
import "../syles/mainSection"
const mainSection = () =>{
    return(
    <section id="Overview" className="section active">
            
        <h1>Overview</h1>
         <div id="map-container">
            <div id="map"></div>

         </div> 
        <div className="cards">
        <div className="card" id="total-villages">
            <div className="card-name">Total Number Of Villages</div>
            <div className="number"></div>
        </div>
        <div className="card" id="total-urban">
            <div className="card-name">Total Number Of Urban Areas</div>
            <div className="number"></div>
        </div>
        <div className="card" id="population">
            <div className="card-name">Total Population</div>
            <div className="number"></div>
            
        </div>
        <div className="card" id="area">
            <div className="card-name">Average Land Area</div>
            <div className="number"></div>
            <h4>sq km</h4>
        </div>
        
        </div> 
        <div className="charts">
             <div className="chart" id="age-distribution">
                <div className="card-name">Age Distribution</div>
                <canvas id="ageChart" ></canvas>

            </div>
            <div className="chart" id="gender-ratios">
                 <div className="card-name">Gender Ratios</div>
                 <canvas id="genderChart"></canvas>

            </div>
             <div className="chart" id="population-chart">
                 <div>
                  <canvas id="populationChart" ></canvas>
                 </div>
            </div>
        </div>

    </section>
    );

}
export default mainSection;