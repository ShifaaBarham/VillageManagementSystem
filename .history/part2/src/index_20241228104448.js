import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AppProvider } from './context/appContext';
import { ReducerProvider } from './context/AppReducer';

const root = ReactDOM.createRoot(document.getElementById('root'));
//App is a child of AppContext
root.render(
  <React.StrictMode>
    <ReducerProvider>
      <AppProvider>

        <App />
        
      </AppProvider>
    </ReducerProvider>
    
  </React.StrictMode>
);
