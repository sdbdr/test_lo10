import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Context, ContextProvider } from "./components/Router/Trip/context";
import LoginForm from "./components/Login/LoginForm";
import WelcomePage from "./components/WelcomePage";
import NavBar from "./components/Header/NavBar";
import {
  ResearchPage,
  TripPage,
  TripManagement,
  TripTasks,
  TripItinary,
  InvitationLink,
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
              <Route path="/" element={<WelcomePage />} />
              <Route path="/research" element={<ResearchPage />} />
              <Route path="/Trips" element={<TripPage />} />
              <Route
                path="/Trips/Management/:tripId"
                element={<TripManagement />}
              />
              <Route path="/Trips/Itinary/:tripId" element={<TripItinary />} />
              <Route path="/Trips/Tasks/:tripId" element={<TripTasks />} />
              <Route path="/invite" element={<InvitationLink />} />
            </Routes>
          </Router>
        </ContextProvider>
      </div>
    );
  } else {
    return (
      <div>
        <ContextProvider>
          <LoginForm onLogin={handleLogin} />
        </ContextProvider>
      </div>
    );
  }
};

export default App;
