import React, { useState, useEffect, createRef, useContext } from "react";
import {
  CircularProgress,
  Grid,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@material-ui/core";

import PlaceDetails from "../PlaceDetails/PlaceDetails";
import useStyles from "./styles.js";
import { Context } from "../Router/Trip/context";

const List = ({ places, type, setType, rating, setRating, isLoading }) => {
  const [elRefs, setElRefs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [tripName, setTripName] = useState("");
  const [tripNamesFromStorage, setTripNamesFromStorage] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [childClicked, setChildClicked] = useState(null);
  const classes = useStyles();
  const { refresh, trips } = useContext(Context);

  const handleClick = (index) => {
    setChildClicked(index);
    // const selectedPlace = places[index];
    // const coordinates = {
    //   lat: selectedPlace.latitude,
    //   lng: selectedPlace.longitude
    // };
    // console.log('Coordonnées de l\'élément sélectionné :', coordinates);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setTripName("");
    setSelectedDate(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Nom du voyage :", tripName);
    console.log("Date sélectionnée :", selectedDate);

    const tripsFromStorage = trips || [];
    const selectedTrip = tripsFromStorage.find(
      (trip) => trip.tripName === tripName
    );
    if (selectedTrip) {
      const tripId = selectedTrip.tripId;
      console.log("Trip ID:", tripId);

      const selectedPlace = places[childClicked];
      if (selectedPlace) {
        console.log("Place sélectionnée :", selectedPlace);

        const newTripPlan = {
          tripName: tripName,
          tripDate: selectedDate,
          lat: selectedPlace.latitude,
          lng: selectedPlace.longitude,
          category: selectedPlace.category?.name,
          name: selectedPlace.name,
          rating: selectedPlace.rating,
          photo: selectedPlace.photo
            ? selectedPlace.photo.images.large.url
            : "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg",
        };

        const trip = tripsFromStorage.find((trip) => {
          return trip.tripId === tripId;
        });
        const updatedTrip = trip
          ? { ...trip, tripPlans: [...trip.tripPlans, newTripPlan] }
          : {};

        const options = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTrip),
        };
        fetch(`http://localhost:8080/api/trips/${updatedTrip.tripId}`, options)
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
      }
    }

    setOpenDialog(false);
    setTripName("");
    setSelectedDate(null);
  };

  useEffect(() => {
    setElRefs((refs) =>
      Array(places.length)
        .fill()
        .map((_, i) => refs[i] || createRef())
    );

    const tripsFromStorage = trips || [];
    const tripNames = tripsFromStorage.map((trip) => trip.tripName);
    setTripNamesFromStorage(tripNames);
  }, [places]);

  const handleTripNameChange = (event) => {
    const selectedTripName = event.target.value;
    setTripName(selectedTripName);

    const tripsFromStorage = trips || [];
    const selectedTrip = tripsFromStorage.find(
      (trip) => trip.tripName === selectedTripName
    );
    if (selectedTrip) {
      const { startDate, endDate } = selectedTrip;
      setSelectedDate(startDate);
      setSelectedEndDate(endDate);
    }
  };

  const isDateDisabled = (date) => {
    if (selectedDate) {
      return date < selectedDate || date > selectedEndDate;
    }
    return false;
  };

  return (
    <div className={classes.container}>
      <Typography variant="h4">Food & Dining around you</Typography>
      {isLoading ? (
        <div className={classes.loading}>
          <CircularProgress size="5rem" />
        </div>
      ) : (
        <>
          <FormControl className={classes.formControl}>
            <InputLabel id="type">Type</InputLabel>
            <Select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <MenuItem value="restaurants">Restaurants</MenuItem>
              <MenuItem value="hotels">Hotels</MenuItem>
              <MenuItem value="attractions">Attractions</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="rating">Rating</InputLabel>
            <Select
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="3">Above 3.0</MenuItem>
              <MenuItem value="4">Above 4.0</MenuItem>
              <MenuItem value="4.5">Above 4.5</MenuItem>
            </Select>
          </FormControl>
          <Grid container spacing={3} className={classes.list}>
            {places?.map((place, i) => (
              <Grid
                ref={elRefs[i]}
                key={i}
                item
                xs={12}
                onClick={() => handleClick(i)}
              >
                <PlaceDetails
                  selected={Number(childClicked) === i}
                  refProp={elRefs[i]}
                  place={place}
                />
              </Grid>
            ))}
          </Grid>
          <Dialog open={openDialog} onClose={handleDialogClose}>
            <form onSubmit={handleFormSubmit}>
              <DialogTitle>Enter Trip Name and Date</DialogTitle>
              <DialogContent>
                <FormControl fullWidth>
                  <InputLabel id="tripNameSelect">Select Trip Name</InputLabel>
                  <Select
                    labelId="tripNameSelect"
                    value={tripName}
                    onChange={handleTripNameChange}
                  >
                    <MenuItem value="">Select a trip</MenuItem>
                    {tripNamesFromStorage.map((name, index) => (
                      <MenuItem key={index} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  id="selectedDate"
                  label="Select Date"
                  type="date"
                  fullWidth
                  value={selectedDate || ""}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  disabled={tripName === ""}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: selectedDate || "",
                    max: selectedEndDate || "",
                    disabled: isDateDisabled,
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose} color="secondary">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={tripName === ""}
                >
                  Add
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default List;
