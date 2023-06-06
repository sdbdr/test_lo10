import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginForm from "./components/Login/LoginForm";
import { ContextProvider } from "./components/Router/Trip/context";
import NavBar from "./components/Header/NavBar";
import {
  ResearchPage,
  TripPage,
  TripManagement,
  TripTasks,
  TripItinary,
} from "./components/Router";
import { logout } from "./api/travelAdvisorAPI";

const App = () => {
  const [session, setSession] = useState({});

  useEffect(() => {
    // Check if user is already authenticated by looking for their session cookie
    const checkAuthentication = () => {
      const sessionId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("sessionId"))
        ?.split("=")[1];

      if (sessionId) {
        setSession({ ...session, sessionId });
      }
    };
    checkAuthentication();
  }, []);

  const handleLogin = (session) => {
    setSession(session);
  };

  const handleLogout = async () => {
    logout();
    setSession({});
  };

  if (session.sessionId) {
    return (
      <div className="App">
        <ContextProvider>
          <Router>
            <NavBar onLogout={handleLogout} />
            <Routes>
              <Route path="/research" element={<ResearchPage />} />
              <Route path="/Trips" element={<TripPage />} />
              <Route path="/Trips/Management/:tripId" element={<TripManagement />} />
              <Route path="/Trips/Itinary" element={<TripItinary />} />
              <Route path="/Trips/Tasks" element={<TripTasks />} />
            </Routes>
          </Router>
        </ContextProvider>
      </div>
    );
  } else {
    return (
      <div>
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }
};

export default App;
