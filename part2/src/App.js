import React from 'react';
import SideBar from "./components/sideBar";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./syles/main.css"
import Overview from "./components/overview/Overview"; 
import VellageManagement from "./components/villagemanagemant/VillageManagement"; 
import Chat from "./components/chat/chat"; 
import Gallery from "./components/gallery/gallery";  
import "./syles/mainSection.css"


function App() {
  return (
    <Router>  
      <React.Fragment>
        <SideBar />
        <main>
          <Routes>
            <Route path="*" element={<Overview />} />
            <Route path="/Overview" element={<Overview />} />
            <Route path="/VellageManagement" element={<VellageManagement />} />
            <Route path="/Chat" element={<Chat />} />
            <Route path="/Gallery" element={<Gallery />} />
          </Routes>
        </main>
      </React.Fragment>
    </Router>
  );
}

export default App;
