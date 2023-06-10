import { createContext, useState, useEffect } from "react";

export const Context = createContext();

export const ContextProvider = (props) => {
  const [id, setId] = useState();
  const [trips, setTrips] = useState([]);
  const [userId, setUserId] = useState();

  // useEffect(() => {
  //   initialize().then(data => {
  //     setTrips(data);
  //   });
  // }, []);

  useEffect(() => {
    if (userId) {
      fetchTripsFromUserId(userId)
        .then((trips) => setTrips(trips))
        .catch((err) => console.log(err));
    }
  }, [userId]);

  const fetchTripsFromUserId = async (userId) => {
    const sessionId=document.cookie.valueOf("sessionId").split("=")[1];
    const response = await fetch("http://localhost:8080/api/trips", {
      method: 'GET',
      headers: {
        'Authorization': sessionId // Include the session ID in the Authorization header
         }
      });
    const trips = await response.json();
    console.log("Trip of users", trips);
    return trips;
  };

  const refresh = () => {
    if (userId) {
      fetchTripsFromUserId(userId)
        .then((trips) => setTrips(trips))
        .catch((err) => console.log(err));
    }
  };

  const contextValue = { id, setId, trips, refresh, userId, setUserId };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};
