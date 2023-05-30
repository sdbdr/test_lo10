import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, Col, Row, Form } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TripNavBar from "../TripNavBar";
import Trip_Itinary from "./Trip_Itinary";
import Trip_Tasks from "./Trip_Tasks";
import { Context } from "../context";
import { useContext, useEffect } from "react";
const TripManagement = () => {
  const { id, setId } = useContext(Context); 


  useEffect(() => {
    const storedId = localStorage.getItem("id");
    setId(storedId);
  }, [setId]);

  

  return (
    <div className="Trip_Management">
      <h1>Paris Trip</h1>
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

      <p>Wed, 17 nov...</p>
      <p>id={id}</p>
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
