import React, { useEffect } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideBar from './components/sideBar';
import Overview from './components/overview/Overview'; 
import VellageManagement from './components/villagemanagemant/VillageManagement'; 
import Chat from './components/chat/chat'; 
import Gallery from './components/gallery/gallery';  
import styles from './syles/mainStyles.module.css';

// إعداد ApolloClient
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', 
  cache: new InMemoryCache()
});

function App() {
  useEffect(() => {
    const userId = "3"; 

    sessionStorage.setItem("userId", userId);
  }, []);

  console.log('ApolloProvider is wrapping the app');
  return (
    <ApolloProvider client={client}>
      <Router>
        <React.Fragment>
          <SideBar />
          <main className={styles.main}> 
            <Routes>
              <Route path="/Overview" element={<Overview />} />
              <Route path="/VellageManagement" element={<VellageManagement />} />
              <Route path="/Chat" element={<Chat />} />
              <Route path="/Gallery" element={<Gallery />} />
            </Routes>
          </main>
        </React.Fragment>
      </Router>
    </ApolloProvider>
  );
}

export default App;
