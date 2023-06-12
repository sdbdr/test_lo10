import React from "react";
import { Context } from "../context";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import TripNavBar from "../TripNavBar";

const Task = ({ task }) => {
  return (
    <div className="mt-4">
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {task.taskName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {task.description}
          </Typography>
          <Typography>
            <Chip
              avatar={<Avatar>{task.tagMember[0].toUpperCase()}</Avatar>}
              label={task.tagMember}
            />
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

const TripTasks = () => {
  const { id, setId, trips, refresh } = useContext(Context);
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");
  const [description, setDescription] = useState("");

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

  const handleTaskChange = (e) => {
    setTaskName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleAddTask = (e) => {
    const newTask = {
      taskName,
      tagMember: memberName,
      description,
    };

    const updatedTrip = trip
      ? { ...trip, tripTasks: [...trip.tripTasks, newTask] }
      : {};

    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTrip),
    };
    fetch(`http://localhost:8080/api/trips/${tripId}`, options)
      .then((response) => {
        refresh();
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error(error);
      });

    closeDialog();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleAddTask();
  };

  return (
    <div className="container">
      {trip && (
        <div className="mt-3 mb-3">
          <TripNavBar id={id} />
          <h4>Tasks of trip: {trip.tripName}</h4>
          <div className="row">
            <div className="col-6">
              {trip.tripTasks.map((task, id) => {
                if (id % 2 === 0) return <Task key={id} task={task} />;
                return null;
              })}
            </div>

            <div className="col-6">
              {trip.tripTasks.map((task, id) => {
                if (id % 2 === 1) return <Task key={id} task={task} />;
                return null;
              })}
            </div>
          </div>
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
            value={taskName}
            onChange={handleTaskChange}
          />

          <FormControl fullWidth>
            <InputLabel id="memberNameSelect">Select Member Name</InputLabel>
            <Select
              labelId="memberNameSelect"
              value={memberName}
              onChange={handleMemberNameChange}
            >
              <MenuItem value="">Select a member</MenuItem>
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
            value={description}
            onChange={handleDescriptionChange}
          />
          {/* Add more text fields for other trip details */}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TripTasks;
