import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

const TripNavbar = ({id}) => {
  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Button>
          <Link to={"/Trips/Management/"+id} className="nav-link text-primary">
            Trip management
          </Link>
        </Button>
        <Button>
          {" "}
          <Link to={"/Trips/Tasks/"+id} className="nav-link text-primary">
            Trip tasks
          </Link>
        </Button>
        <Button>
          <Link to={"/Trips/Itinary/"+id} className="nav-link text-primary">
            Trip itinary
          </Link>
        </Button>
      </Container>
    </Navbar>
  );
};

export default TripNavbar;
