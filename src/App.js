import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ContextProvider } from './components/Router/Trip/context';
import NavBar from "./components/Header/NavBar";
import { ResearchPage, TripPage, TripManagement,Trip_Tasks,Trip_Itinary } from "./components/Router";


const App = () => {
  return (
    <div className="App">
  <ContextProvider>
    <Router>
      <NavBar />
      <Routes>
        <Route path="/research" element={<ResearchPage />} />    
        <Route path="/Trips" element={<TripPage />} />
        <Route path="/Trips/Management" element={ <TripManagement />   }/>
        <Route path="/Trips/Itinary" element={ <Trip_Itinary />    }/>
        <Route path="/Trips/Tasks" element={ <Trip_Tasks />   }/>             
      </Routes>
  </Router>
</ContextProvider>
    </div>
  );
};

export default App;
