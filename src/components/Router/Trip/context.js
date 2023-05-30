import { createContext, useState, useEffect } from "react";

export const Context = createContext(null);

const initialize = () => {
  return fetch("http://localhost:8080/api/trips")
    .then(response => response.json())
    .catch(error => {
      console.log(error);
    });
};

export const ContextProvider = (props) => {
  const [id, setId] = useState();
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    initialize().then(data => {
      setTrips(data);
    });
  }, []);

  const refresh = () => {
    fetch("http://localhost:8080/api/trips")
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setTrips(data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const contextValue = { id, setId, trips, refresh };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};
