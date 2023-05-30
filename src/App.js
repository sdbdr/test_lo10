import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginForm from "./components/Login/LoginForm";
import { ContextProvider } from "./components/Router/Trip/context";
import NavBar from "./components/Header/NavBar";
import {
  ResearchPage,
  TripPage,
  TripManagement,
  Trip_Tasks,
  Trip_Itinary,
} from "./components/Router";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already authenticated by looking for their session cookie
    const fetchUser = async () => {
      const response = await fetch("/api/user");
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  const handleLogin = (user) => {
    setUser(user);
  };

  const handleLogout = async () => {
    await fetch("/api/logout");
    setUser(null);
  };

  if (user) {
    return (
      <div className="App">
        <ContextProvider>
          <Router>
            <NavBar />
            <Routes>
              <Route path="/research" element={<ResearchPage />} />
              <Route path="/Trips" element={<TripPage />} />
              <Route path="/Trips/Management" element={<TripManagement />} />
              <Route path="/Trips/Itinary" element={<Trip_Itinary />} />
              <Route path="/Trips/Tasks" element={<Trip_Tasks />} />
            </Routes>
          </Router>
        </ContextProvider>
      </div>
    );
  } else {
    return (
      <div>
        <h3>Please login!</h3>
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }
};

export default App;
