import React from "react";
import TripNavBar from "../TripNavBar";
import { Context } from "../context";
import { useContext, useEffect } from "react";

const TripTasks = () => {
  const { id, setId } = useContext(Context);

  useEffect(() => {
    const storedId = localStorage.getItem("id");
    setId(storedId);
  }, [setId]);

  return (
    <div>
      <p>Tasks id={id}</p>
      <TripNavBar />
    </div>
  );
};

export default TripTasks;
