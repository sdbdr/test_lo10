import { createContext, useState, useEffect } from "react";

import { fetchTripsFromUserId } from "../../../api/travelAdvisorAPI";

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

  const refresh = () => {
    if (userId) {
      console.log("userId", userId);
      fetchTripsFromUserId(userId)
        .then((trips) => setTrips(trips))
        .catch((err) => console.log(err));
    }
  };

  const resetContext = () => {
    setId(null);
    setTrips(null);
    setUserId(null);
  };

  const contextValue = {
    id,
    setId,
    userId,
    setUserId,
    trips,
    refresh,
    resetContext,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};
