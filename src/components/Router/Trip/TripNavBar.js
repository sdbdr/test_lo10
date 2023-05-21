import React from 'react';
import { Link } from "react-router-dom";
import {  Button } from '@material-ui/core';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';


const TripNavbar = () => {
    
 
    return(
        <Navbar bg="light" variant="light">
        <Container>          
          
          <Button><Link to={"/Trips/Management"} className="nav-link text-primary">Trip management</Link></Button>  
          <Button> <Link to={"/Trips/Tasks"} className="nav-link text-primary">Trip tasks</Link></Button> 
          <Button><Link to={"/Trips/Itinary"} className="nav-link text-primary">Trip itinary</Link></Button> 
         
        </Container>
      </Navbar>
    );
}

export default TripNavbar;