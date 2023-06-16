import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
// import { Card } from "react-bootstrap";
import { Avatar, Card, CardContent, Chip, Typography } from "@material-ui/core";

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
              <CardContent style={{ padding: "5px" }}>
                {" "}
                Code: {new URL(trip.invitationLink).searchParams.get(
                  "code"
                )}{" "}
              </CardContent>
            </Card>
          </div>

          <Card className="mb-4" style={{ padding: "20px" }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Basic informations
              </Typography>
              <Typography>
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
              </Typography>
            </CardContent>
          </Card>

          <Card className="mb-4" style={{ padding: "20px" }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Trip members
              </Typography>
              <div className="row">
                <div className="col-6">
                  {trip.tripMembers.map((member, index) => {
                    if (index % 2 === 0)
                      return (
                        <Chip
                          avatar={
                            <Avatar>{member.name[0].toUpperCase()}</Avatar>
                          }
                          label={member.name}
                        />
                      );
                    return null;
                  })}
                </div>

                <div className="col-6">
                  {trip.tripMembers.map((member, index) => {
                    if (index % 2 !== 0)
                      return (
                        <Chip
                          avatar={
                            <Avatar>{member.name[0].toUpperCase()}</Avatar>
                          }
                          label={member.name}
                        />
                      );
                    return null;
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TripManagement;
