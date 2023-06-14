import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GoogleMapReact from "google-map-react";
import {
  Card,
  CardMedia,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";

import TripNavBar from "../TripNavBar";
import mapStyles from "../../../../mapStyles";
import { Context } from "../context";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const ItinaryMap = ({ places }) => {
  const [coords, setCoords] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    if (places.length) {
      console.log(places);
      // Calculate the initial center coordinates
      let minLat = Infinity;
      let maxLat = -Infinity;
      let minLng = Infinity;
      let maxLng = -Infinity;

      places.forEach((place) => {
        const { lat, lng } = place;
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        if (latitude < minLat) minLat = latitude;
        if (latitude > maxLat) maxLat = latitude;
        if (longitude < minLng) minLng = longitude;
        if (longitude > maxLng) maxLng = longitude;
      });

      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;

      setCoords({ lat: centerLat, lng: centerLng });
    }
  }, [places]);

  const renderMarkers = () => {
    return places.map((place, i) => (
      <Marker
        key={i}
        lat={place.lat}
        lng={place.lng}
        name={place.name}
        photo={place.photo}
      />
    ));
  };

  const renderPolylines = () => {
    const coordinates = places.map((place) => ({
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lng),
    }));

    if (coordinates.length < 2) return null;

    const path = coordinates.map(
      ({ lat, lng }) => new window.google.maps.LatLng(lat, lng)
    );

    return (
      <Polyline
        path={path}
        options={{
          strokeColor: "#FF0000",
          strokeOpacity: 1,
          strokeWeight: 3,
        }}
      />
    );
  };

  return (
    <div style={{ height: "85vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_API_KEY }}
        defaultCenter={coords}
        center={coords}
        defaultZoom={14}
        margin={[50, 50, 50, 50]}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: mapStyles,
        }}
      >
        {renderMarkers()}
        {renderPolylines()}
      </GoogleMapReact>
    </div>
  );
};

const Marker = ({ lat, lng, name, photo }) => (
  <div
    style={{
      position: "absolute",
      transform: "translate(-50%, -50%)",
      width: "100px",
    }}
    lat={lat}
    lng={lng}
  >
    <div>
      <Card>
        <CardContent>
          <b>{name}</b>
          <img src={photo} alt={name} style={{ width: "100%" }} />
        </CardContent>
      </Card>
    </div>
  </div>
);

const Polyline = ({ path, options }) => (
  <google-map-react-polyline path={path} options={options} />
);

const TripItinaryContent = ({ places }) => {
  const classes = useStyles();

  return (
    <div className="mt-4">
      <Grid container spacing={3} style={{ width: "100%" }}>
        <Grid item xs={12} md={4}>
          <Grid container spacing={3} className={classes.list}>
            {places?.map((place, i) => (
              <Grid className="m-2" key={i} xs={12}>
                <Card>
                  <CardHeader></CardHeader>
                  <CardMedia
                    className={classes.media}
                    image={place.photo}
                    title={place.name}
                  ></CardMedia>
                  <CardContent>
                    <Typography>{place.category}</Typography>
                    <Typography>{place.name}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          style={{
            position: "relative",
            height: "100%",
          }}
        >
          <div style={{ width: "100%", height: "100vh" }}>
            <ItinaryMap places={places ? places : []} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

const TripItinary = (props) => {
  const { id, setId, trips } = useContext(Context);
  const [trip, setTrip] = useState([]);
  const { tripId } = useParams();

  useEffect(() => {
    setId(tripId);
    const tripFound = trips.find((trip) => trip.tripId === tripId);
    if (tripFound) {
      setTrip(tripFound);
    }
  }, [setId, tripId, trips]);

  return (
    <div className="container mt-4 mb-4">
      {trip && (
        <div>
          <TripNavBar id={id} />
          <h4 className="mt-3 mb-3">Itinary of trip: {trip.tripName}</h4>
          <TripItinaryContent places={trip.tripPlans} />
        </div>
      )}
    </div>
  );
};

export default TripItinary;
