import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Col, Row } from "react-bootstrap";
import { Context } from "../context";
import TripNavBar from "../TripNavBar";

const TripManagement = () => {
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
    <div className="container trip-management">
      {trip && (
        <>
          <h1>{trip.tripName}</h1>
          <TripNavBar id={id} />

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

          <p>Start date: {trip.startDate}</p>
          <p>id={id}</p>
          <br />

          <Card style={{ width: "100rem" }}>
            <Row>
              <Card.Title>Trip Members</Card.Title>
              <Col xs={6}>
                {trip.tripMembers.map((member, index) => {
                  if (index % 2 === 0)
                    return <Card.Text>{member.name}</Card.Text>;
                  return;
                })}
              </Col>

              <Col xs={6}>
                {trip.tripMembers.map((member, index) => {
                  if (index % 2 !== 0)
                    return <Card.Text>{member.name}</Card.Text>;
                  return;
                })}
              </Col>
            </Row>
          </Card>
        </>
      )}
    </div>
  );
};

export default TripManagement;
