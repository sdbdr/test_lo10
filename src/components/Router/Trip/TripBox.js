import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';

const TripBox = (props) => {
  
  return (
    <div className="Trip_box">
        <Link to={"/Trips/Management?id="+props.trip.id}>
             <Button   variant="outline-none">
                <Card style={{ width: '25rem' }}>
                    <Row>
                    <Col xs={4} style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
                    <Card.Text>                  
                   {props.trip.description}
                    </Card.Text>                
                    </Col>

                    <Col xs={8} className=" justify-content-center align-items-center">
                    <Card.Title>                
                    {props.trip.title}
                    </Card.Title>                     
                    <Card.Subtitle className="mb-2 text-muted">{props.trip.subtitle}</Card.Subtitle>
                    <br/><br/><br/>                      
                    <Card.Text className="mb-2 text-muted">{props.trip.period}</Card.Text>
                    </Col>
                    </Row>
                </Card>
             </Button>
        </Link>
    </div>
  );
};

export default TripBox;