import React, { useEffect, useState, useCallback, useContext } from "react";
import { useLocation } from "react-router-dom";

import { Context } from "../context";

const InvitationLink = (props) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");

  const { refresh } = useContext(Context);
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const invitationLink = `http://localhost:3000/invite?code=${code}`;

  useEffect(() => {
    handleInvitationLink();
  }, [code]);

  const handleInvitationLink = useCallback(() => {
    fetch(`http://localhost:8080/api/trips`)
      .then((response) => response.json())
      .then((trips) => {
        const trip = trips.find(
          (trip) => trip.invitationLink === invitationLink
        );

        if (trip) {
          setTrip(trip);

          const newMember = JSON.parse(localStorage.getItem("user"));
          const isNewMember = trip.tripMembers.find(
            (member) => member.id === newMember.id
          );

          if (isNewMember) {
            setMessage("You are already in the trip!");
            return;
          }

          trip.tripMembers.push(newMember);
          const options = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(trip),
          };
          fetch(`http://localhost:8080/api/trips/${trip.tripId}`, options)
            .then((response) => {
              refresh();
              return response.json();
            })
            .then((data) => {
              console.log("Trip updated successfully:", data);
              return data;
            })
            .catch((error) => {
              console.error("Error updating trip:", error);
              setError(error);
            });
        } else {
          console.log("No trip found for the invitation link");
        }
      })
      .catch((error) => {
        console.error("Error retrieving trips data:", error);
        setError(error);
      });
  }, [code]);

  return (
    <div className="container mt-3">
      {trip && (
        <div>
          <h2>
            Join Trip: {trip?.tripName} with invitation code {code}
          </h2>
          <div>{message}</div>
        </div>
      )}
      {error && <h2>Error</h2>}
    </div>
  );
};

export default InvitationLink;
