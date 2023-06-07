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
    const response = await fetch("http://localhost:8080/api/trips");
    const trips = await response.json();
    const tripsOfUser = [];
    trips.forEach((trip) => {
      const isFound = trip.tripMembers.find(
        (user) => parseInt(user.id) === parseInt(userId)
      );
      if (isFound) {
        tripsOfUser.push(trip);
      }
    });
    console.log("Trip of users", tripsOfUser);
    return tripsOfUser;
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
