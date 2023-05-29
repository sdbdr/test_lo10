import React from "react";
import { useLocation } from "react-router-dom";
import { Card, Col, Row } from "react-bootstrap";

const TripDetail = (props) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const trip = location.state || {};
  const {
    tripId,
    tripName,
    startDate,
    endDate,
    period,
    city,
    description,
    budget,
    tripMembers,
    tripPlans,
  } = trip;

  //on récupère l'id du voyage ensuite on fait une requete pour récupérer les données détaillées du voyage. Si l'id n'est pas trouvé on renvoi
  //un message d'erreur

  return (
    <div className="Trip_Details">
      <h1>{tripName}</h1>
      <p>Start date: {startDate}</p>
      <p>End date: {endDate}</p>
      <p>id={tripId}</p>
      <p>Period: {period} days</p>
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

export default TripDetail;
