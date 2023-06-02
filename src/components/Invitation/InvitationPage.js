import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";

const InviteLink = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();
  const { tripId, code } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(`/api/trips/${tripId}/accept-invitation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      history.push(`/trip/${tripId}`);
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
    <div>
      <h1>Join the trip</h1>
      <p>Please enter your credentials to join the trip.</p>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Join</button>
      </form>
    </div>
  );
};

export default InviteLink;
