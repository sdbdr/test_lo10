import React from "react";
import TripNavBar from "../TripNavBar";
import { Context } from "../context";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const TripTasks = () => {
  const { id, setId, trips } = useContext(Context);
  const [trip, setTrip] = useState(null);
  const { tripId } = useParams();

  useEffect(() => {
    setId(tripId);
    const tripFound = trips.find((trip) => trip.tripId === tripId);
    if (tripFound !== undefined) {
      setTrip(tripFound);
    }
  }, [setId, tripId, trips]);

  return (
    <div className="container">
      {trip && (
        <div className="mt-3 mb-3">
          <TripNavBar id={id} />
          <h4>Tasks of trip: {trip.tripName}</h4>
        </div>
      )}
    </div>
  );
};

export default TripTasks;
