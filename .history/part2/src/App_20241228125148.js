import React from 'react';
import SideBar from "./components/sideBar";
import Container from "./components/container";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>  
      <React.Fragment>
        <SideBar />
        <div className='sections'>
          <Routes>
            <Route path="/Overview" element={<Overview />} />
            <Route path="/Vellage-Management" element={<VellageManagement />} /> {/* تأكد من تصحيح اسم المكون هنا */}
            <Route path="/Chat" element={<Chat />} />
            <Route path="/Gallery" element={<Gallery />} />
          </Routes>
        </div>
      </React.Fragment>
    </Router>
  );
}

export default App;
