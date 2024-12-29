import React from 'react';
import SideBar from "./components/sideBar" 
import "./syles/mainSection.css"
import MainSection from "./components/mainSection"

function App() {

  return (
    <React.Fragment>

      <SideBar /> 
      <main>
        <MainSection />
      </main>

    </React.Fragment>
  );
}

export default App;
