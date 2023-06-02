import React from "react";
import TripNavBar from "../TripNavBar";
import { Context } from "../context";
import { useContext, useEffect } from "react";

const TripItinary = () => {
  const { id, setId } = useContext(Context);

  useEffect(() => {
    const storedId = localStorage.getItem("id");
    setId(storedId);
  }, [setId]);

  return (
    <div>
      <p>itinary id={id}</p>
      <TripNavBar />
    </div>
  );
};

export default TripItinary;
