import React, { useContext, useState } from "react";
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { Context } from "./context";
import TripBox from "./TripBox";
import { getPeriod } from "../../../utils/formatDate";

const TripPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const { refresh } = useContext(Context);

  const { trips } = useContext(Context);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleAddTrip = () => {
    const idGenerated = Math.random().toString(36).substring(2, 7);
    const newTrip = {
      tripId: idGenerated, // You can generate a unique ID for each trip
      tripName: title,
      startDate,
      endDate,
      period: getPeriod(startDate, endDate), // You can define a function to calculate the period in days
      city: "", // Replace with the actual city
      description,
      budget: "", // Set an initial budget value or replace with the actual budget
      tripMembers: [JSON.parse(localStorage.getItem("user"))], // Add the members dynamically as needed
      tripPlans: [], // Add the plans dynamically as needed
    };

    closeDialog();

    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTrip),
    };
    fetch("http://localhost:8080/api/trips", option)
      .then((response) => {
        if (response.ok) {
          console.log(response.text());
          refresh();
        } else {
          // Handle errors
          throw new Error("POST request failed");
        }
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
      });
  };

  return (
    <div className="container trips">
      {/* TripBox component */}
      {trips.map((trip, id) => {
        return <TripBox key={id} {...trip} />;
      })}

      {/* Round "+" button */}
      <Fab
        color="primary"
        aria-label="add"
        style={{ position: "fixed", bottom: "1rem", right: "1rem" }}
        onClick={openDialog}
      >
        <AddIcon />
      </Fab>

      {/* Dialog form */}
      <Dialog open={isOpen} onClose={closeDialog}>
        <DialogTitle>Add Trip</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={handleTitleChange}
          />
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            value={startDate}
            onChange={handleStartDateChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{}}
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            value={endDate}
            onChange={handleEndDateChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{}}
          />

          <TextField
            label="Description"
            multiline
            rows={4}
            fullWidth
            value={description}
            onChange={handleDescriptionChange}
          />
          {/* Add more text fields for other trip details */}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddTrip} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TripPage;
