import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useContext } from "react";
import { Context } from "./context";


const TripBox = (props) => {
  
  const {tripName,tripId,description,subtitle,period}=props;
 

  return (
    <div className="Trip_box">
      <Link to={"/Trips/Management/"+tripId}>
        <Button variant="outline-none" >
          <Card style={{ width: "25rem" }}>
            <Row>
              <Col xs={4} style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
                <Card.Text>{description}</Card.Text>
              </Col>

              <Col
                xs={8}
                className=" justify-content-center align-items-center"
              >
                <Card.Title>{tripName}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {subtitle}
                </Card.Subtitle>
                <br />
                <br />
                <br />
                <Card.Text className="mb-2 text-muted">
                  {period}
                </Card.Text>
              </Col>
            </Row>
          </Card>
        </Button>
      </Link>
    </div>
  );
};

export default TripBox;
