import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, Col, Row, Form } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TripNavBar from "../TripNavBar";

import { Context } from "../context";
import { useContext, useEffect } from "react";
const TripManagement = () => {
  const [trip, setTrip] = useState({});
  const { id, setId } = useContext(Context);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const idURL = queryParams.get("id");

  const fetchTrip = async (tripId) => {
    const response = await fetch(`http://localhost:8080/api/trips/${tripId}`);
    const trip = await response.json();
    console.log("TRIP", trip);

    return trip;
  };

  useEffect(() => {
    fetchTrip(idURL)
      .then((trip) => setTrip(trip))
      .catch((err) => console.log(err));

    if (/^\d+$/.test(idURL) && parseInt(idURL) >= 0) {
      setId(idURL);
    } else if (localStorage.getItem("id") !== "null") {
      setId(localStorage.getItem("id"));
    } else {
      setId("");
    }
  }, [idURL]);

  useEffect(() => {
    localStorage.setItem("id", id);
  }, [id]);

  //on récupère l'id du voyage ensuite on fait une requete pour récupérer les données détaillées du voyage. Si l'id n'est pas trouvé on renvoi
  //un message d'erreur

  return (
    <div className="Trip_Management">
      <h1>{trip.description}</h1>
      <TripNavBar />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: "20px",
          fontSize: "20px",
        }}
      >
        <Card border="primary">
          <Card.Text style={{ padding: "5px" }}> Code:119 </Card.Text>
        </Card>
      </div>

      <p>
        <b>From:</b> {trip.startDate} <b>to</b> {trip.endDate} ({trip.period}{" "}
        days)
      </p>
      <br />

      <Card style={{ width: "100rem" }}>
        <Row>
          <Card.Title>Trip Members</Card.Title>
          <Col xs={6}>
            <Card.Text> ALex </Card.Text>
            <Card.Text> Jhon</Card.Text>
          </Col>

          <Col xs={6}>
            <Card.Text> Alane</Card.Text>
            <Card.Text> james</Card.Text>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default TripManagement;
