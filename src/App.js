import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/Header/NavBar";
import { ResearchPage, TripPage, TripDetail } from "./components/Router";

const App = () => {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/trips" element={<TripPage />} />
          <Route path="/trips/details" element={<TripDetail />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
