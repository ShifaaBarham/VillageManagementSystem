import { useContext } from 'react';
import sideBar from './components/sideBar' 


function App() {
  const {villages, setVellages} = useContext(AppContext);

  return (
    <React.Fragment>
      <sideBar />      
    </React.Fragment>
  );
}

export default App;
