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
        <div>
          <TripNavBar id={id} />
          <h2>{trip.tripName}</h2>

          <div
            className="mb-4"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              fontSize: "20px",
            }}
          >
            <Card border="primary">
              <Card.Text style={{ padding: "5px" }}>
                {" "}
                Code: {new URL(trip.invitationLink).searchParams.get(
                  "code"
                )}{" "}
              </Card.Text>
            </Card>
          </div>

          <Card className="mb-4" style={{ padding: "20px" }}>
            <Card.Body>
              <Card.Title>Basic informations</Card.Title>
              <Card.Text>
                <div>
                  <b>Start date: </b>
                  {new Date(trip.startDate).toDateString()}
                </div>
                <div>
                  <b>Period: </b>
                  {trip.period} day(s)
                </div>
                <div>
                  <b>id: </b>
                  {id}
                </div>
                <div>
                  <b>Invitation link: </b>
                  {trip.invitationLink}
                </div>
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className="mb-4" style={{ padding: "20px" }}>
            <Row>
              <Card.Body>
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
              </Card.Body>
            </Row>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TripManagement;
