const fs = require("fs");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const UserController = require(`${__dirname}/controllers/UserController`);
const TripController = require(`${__dirname}/controllers/TripController`);

const app = express();
const port = 8080;

const userController = new UserController();
const tripController = new TripController();

/**
 * Authentication
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const generateSessionSecret = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Create session/cookie
app.use(
  session({
    secret: generateSessionSecret(),
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    },
  })
);

const cors = require("cors");
app.use(cors());

// Authentication route: Define a route to handle the incoming data
app.post("/api/login", userController.login);
app.post("/api/logout", userController.logout);

// Trip route
app.get("/api/trips", tripController.getTrips);
app.get("/api/trips/:id", tripController.getTripById);
app.post("/api/trips", tripController.createTrip);
app.put("/api/trips/:id", tripController.updateTrip);

// Invitation route
app.post("/api/trips/:tripId/invite", tripController.sendInvitation);
app.get(
  "/api/trips/:tripId/invite/:code",
  tripController.validateInvitationLink
);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
