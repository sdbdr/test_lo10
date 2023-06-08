import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  btnField: {
    margin: theme.spacing(2),
  },
}));

const InvitationLink = (props) => {
  const classes = useStyles();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");
  console.log("code", code)

  const [trip, setTrip] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
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

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();

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
    <div className="container mt-3">
      {/* <h2>Join Trip: {trip.tripName}</h2> */}
      <h2>Join Trip: </h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
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
        <TextField
          label="Password"
          fullWidth
          value={password}
          onChange={handlePasswordChange}
        />
       <Button
        className={classes.btnField}
        variant="contained"
        color="primary"
        type="submit"
      >
        Join
      </Button>
      </form>
    </div>
  );
};

export default InvitationLink;
