import React from "react";
import { Context } from "../context";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import TripNavBar from "../TripNavBar";

const TripTasks = () => {
  const { id, setId, trips } = useContext(Context);
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [task, setTask] = useState("");
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");
  const [description, setDescription] = useState("");
  const [tripTasksFromStorage, setTripTasksFromStorage] = useState([]);

  useEffect(() => {
    setId(tripId);
    const tripFound = trips.find((trip) => trip.tripId === tripId);
    if (tripFound !== undefined) {
      setTrip(tripFound);
    }
  }, [setId, tripId, trips]);

  useEffect(() => {
    const tripOfUser = trips?.find((trip) => trip.tripId === tripId);
    const tripMembers = tripOfUser?.tripMembers.map((member) => member.name);

    setMembers(tripMembers);
  }, [trips]);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const handleMemberNameChange = (e) => {
    const selectedMember = e.target.value;
    setMemberName(selectedMember);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container">
      {trip && (
        <div className="mt-3 mb-3">
          <TripNavBar id={id} />
          <h4>Tasks of trip: {trip.tripName}</h4>
        </div>
      )}

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
            label="Task name"
            fullWidth
            value={task}
            // onChange={handleTitleChange}
          />

          <FormControl fullWidth>
            <InputLabel id="memberNameSelect">Select Member Name</InputLabel>
            <Select
              labelId="memberNameSelect"
              value={memberName}
              onChange={handleMemberNameChange}
            >
              <MenuItem value="">Select a trip</MenuItem>
              {members?.map((name, index) => (
                <MenuItem key={index} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Description"
            multiline
            rows={4}
            fullWidth
            // value={description}
            // onChange={handleDescriptionChange}
          />
          {/* Add more text fields for other trip details */}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button color="primary">Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TripTasks;
