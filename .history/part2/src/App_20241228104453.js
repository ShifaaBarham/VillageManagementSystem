import sideBar from './components/sideBar' 


function App() {
  const {villages, setVellages} = useContext(AppContext);

  return (
    
    <>
      <sideBar />      
    </>
  );
}

export default App;
