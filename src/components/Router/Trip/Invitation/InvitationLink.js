import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TextField, Button } from "@material-ui/core";

const InvitationLink = (props) => {
  const { code } = useParams();
  const [trip, setTrip] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/api/invitations/${code}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Invalid invitation code");
        }
      })
      .then((data) => {
        setTrip(data.trip);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [code]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const user = {
      name,
      email,
    };

    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    };

    fetch(`http://localhost:8080/api/trips/${trip.tripId}/join`, option)
      .then((response) => {
        if (response.ok) {
          setIsSubmitted(true);
        } else {
          throw new Error("Failed to join the trip");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isSubmitted) {
    return <div>Successfully joined the trip!</div>;
  }

  return (
    <div>
      <h2>Join Trip: {trip.tripName}</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          fullWidth
          value={name}
          onChange={handleNameChange}
        />
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={handleEmailChange}
        />
        <Button type="submit" color="primary">
          Join
        </Button>
      </form>
    </div>
  );
};

export default InvitationLink;
