import React from 'react';
import SideBar from "./components/sideBar";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./syles/main.css"
import Overview from "./sections/Overview"; 
import VellageManagement from "./sections/VellageManagement"; 
import Chat from "./sections/Chat"; 
import Gallery from "./sections/Gallery";  


function App() {
  return (
    <Router>  
      <React.Fragment>
        <SideBar />
        <main>
        <section id="Overview" class="section active">
            
            <h1>Overview</h1>
            <div id="map-container">
                <div id="map"></div>
        
            </div> 
            <div class="cards">
                <div class="card" id="total-villages">
                    <div class="card-name">Total Number Of Villages</div>
                    <div class="number"></div>
                </div>
                <div class="card" id="total-urban">
                    <div class="card-name">Total Number Of Urban Areas</div>
                    <div class="number"></div>
                </div>
                <div class="card" id="population">
                    <div class="card-name">Total Population</div>
                    <div class="number"></div>
                    
                </div>
                <div class="card" id="area">
                    <div class="card-name">Average Land Area</div>
                    <div class="number"></div>
                    <h4>sq km</h4>
                </div>
                
            </div> 
            <div class="charts">
                <div class="chart" id="age-distribution">
                    <div class="card-name">Age Distribution</div>
                    <canvas id="ageChart" ></canvas>
        
                </div>
                <div class="chart" id="gender-ratios">
                    <div class="card-name">Gender Ratios</div>
                    <canvas id="genderChart"></canvas>
        
                </div>
                <div class="chart" id="population-chart">
                    <div>
                        <canvas id="populationChart" ></canvas>
                      </div>
                </div>
            </div>
        
        </section>
          <Routes>
            <Route path="*" element={<Overview />} />
            <Route path="/Overview" element={<Overview />} />
            <Route path="/VellageManagement" element={<VellageManagement />} /> {/* تأكد من تصحيح اسم المكون هنا */}
            <Route path="/Chat" element={<Chat />} />
            <Route path="/Gallery" element={<Gallery />} />
          </Routes>
        </main>
      </React.Fragment>
    </Router>
  );
}

export default App;
