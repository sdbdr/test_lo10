import React from "react";
import TripNavBar from "../TripNavBar";
import { Context } from "../context";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TripItinary = () => {
  const { id, setId, trips } = useContext(Context);
  const [trip, setTrip] = useState(null);
  const { tripId } = useParams();
  
  useEffect(() => {
    setId(tripId);    
    const tripFound = trips.find((trip) => trip.tripId === tripId);
    if (tripFound !== undefined) {
      setTrip(tripFound);
    }
  }, [setId, tripId,trips]);

  return (
    <div>{trip &&( <>
      <p>itinary of trip:{trip.tripName}</p>
      <TripNavBar id={id}/>
      </>)}
    </div>
  );
};

export default TripItinary;
