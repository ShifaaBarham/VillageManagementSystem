import React from 'react';
import SideBar from "./components/sideBar";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./syles/main.css"
import Overview from "./sections/Overview"; 
import VellageManagement from "./sections/VellageManagement"; 
import Chat from "./sections/Chat"; 
import Gallery from "./sections/Gallery";  
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
