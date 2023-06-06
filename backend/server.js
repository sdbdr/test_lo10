const fs = require("fs");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();
const port = 8080;

/**
 * Authentication
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const generateSessionSecret = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Middleware to parse request bodies
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

// Define a route to handle the incoming data
// testuser : password123
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  fs.readFile(`${__dirname}/users.json`, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ error: "Error reading users.json" });
    }

    const users = JSON.parse(data);
    const user = users.find((user) => user.username === username);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username" });
    }

    const passwordMatch = user.password === password;
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    req.session.userId = user.id; // Store the user ID in the session
    res.cookie("sessionId", req.session.id, {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });
    res.json({
      success: true,
      session: { sessionId: req.session.id },
      userId: user.id,
    });
  });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    } else {
      res.clearCookie();
      res.redirect("http://localhost:3000/");
    }
  });
});

/**
 * API for trip's data
 */
app.post("/api/trip", (req, res) => {
  const { tripName, startDate, endDate, period, city, description, budget } =
    req.body;

  const tripId = generateTripId();
  const invitationLink = `https://localhost:3000/invite?code=${generateInvitationCode()}`;
  const newTrip = {
    tripId,
    tripName,
    startDate,
    endDate,
    period,
    city,
    description,
    budget,
    tripMembers: [],
    invitationLink,
  };

  fs.readFile(`${__dirname}/trip.json`, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: "Error reading trip.json" });
    }

    const trips = JSON.parse(data);
    trips.push(newTrip);

    fs.writeFile(`${__dirname}/trip.json`, JSON.stringify(trips), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ error: "Error writing to trip.json" });
      }
      res.send({ tripId });
    });
  });
  console.log(newTrip);
  res.send("Data received successfully");
});

app.get("/api/trips", (req, res) => {
  fs.readFile(`${__dirname}/trip.json`, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: "Error reading trip.json" });
    }
    const trips = JSON.parse(data);
    res.send(trips);
  });
});

app.get("/api/trips/:id", (req, res) => {
  fs.readFile(`${__dirname}/trip.json`, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: "Error reading trip.json " + err });
    }

    const trips = JSON.parse(data);
    const id = req.params.id;
    if (id) {
      const trip = trips.find((trip) => parseInt(trip.tripId) === parseInt(id));
      if (trip) {
        res.json(trip);
      } else {
        res.status(404).send("Trip not found");
      }
    }
  });
});

// ---------------------------------------------------------------
app.post("/api/trips/:tripId/invite", (req, res) => {
  const { tripId } = req.params;
  const { email } = req.body;

  fs.readFile(`${__dirname}/trip.json`, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: "Error reading trip.json" });
    }

    const trips = JSON.parse(data);
    const tripIndex = trips.findIndex(
      (trip) => trip.tripId === parseInt(tripId)
    );

    if (tripIndex === -1) {
      return res
        .status(404)
        .send({ error: `Trip with ID ${tripId} not found` });
    }

    const tripMembers = trips[tripIndex].tripMembers;
    const memberIndex = tripMembers.findIndex(
      (member) => member.email === email
    );

    if (memberIndex !== -1) {
      return res
        .status(400)
        .send({ error: `Member with email ${email} is already a trip member` });
    }

    const invitationLinks = trips[tripIndex].invitationLinks || [];
    const existingInvitation = invitationLinks.find(
      (invitation) => invitation.email === email
    );

    if (existingInvitation) {
      return res
        .status(400)
        .send({ error: `User with email ${email} has already been invited` });
    }

    const link = `https://example.com/invite?code=${generateInvitationCode()}`;
    invitationLinks.push({ email, link });
    trips[tripIndex].invitationLinks = invitationLinks;

    fs.writeFile(`${__dirname}/trip.json`, JSON.stringify(trips), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ error: "Error writing to trip.json" });
      }
      res.send({ message: `Invitation sent to ${email}` });
    });
  });
});

app.post("/api/trips/:tripId/accept-invitation", (req, res) => {
  const { tripId } = req.params;
  const { code, username, password } = req.body;

  fs.readFile(`${__dirname}/users.json`, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: "Error reading users.json" });
    }

    const users = JSON.parse(data);
    const user = users.find((user) => user.username === username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).send({ error: "Invalid username or password" });
    }

    fs.readFile(`${__dirname}/trip.json`, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ error: "Error reading trip.json" });
      }

      const trips = JSON.parse(data);
      const tripIndex = trips.findIndex(
        (trip) => trip.tripId === parseInt(tripId)
      );

      if (tripIndex === -1) {
        return res
          .status(404)
          .send({ error: `Trip with ID ${tripId} not found` });
      }

      const invitationLinks = trips[tripIndex].invitationLinks || [];
      const invitation = invitationLinks.find((invitation) =>
        invitation.link.includes(code)
      );

      if (!invitation) {
        return res
          .status(400)
          .send({ error: `Invitation with code ${code} not found` });
      }

      const tripMembers = trips[tripIndex].tripMembers;
      const existingMember = tripMembers.find(
        (member) => member.email === user.email
      );

      if (existingMember) {
        return res.status(400).send({
          error: `User with email ${user.email} is already a trip member`,
        });
      }

      tripMembers.push({ name: user.name, email: user.email, invited: false });
      trips[tripIndex].tripMembers = tripMembers;
      invitationLinks.splice(invitationLinks.indexOf(invitation), 1);
      trips[tripIndex].invitationLinks = invitationLinks;

      fs.writeFile(`${__dirname}/trip.json`, JSON.stringify(trips), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: "Error writing to trip.json" });
        }
        res.send({ message: `User ${user.name} added to trip ${tripId}` });
      });
    });
  });
});

const generateInvitationCode = () => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += characters[Math.floor(Math.random() * characters.length)];
  }
  return code;
};

app.get("/api/trips/:tripId/invite/:code", (req, res) => {
  const { tripId, code } = req.params;

  fs.readFile(`${__dirname}/trip.json`, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: "Error reading trip.json" });
    }

    const trips = JSON.parse(data);
    const trip = trips.find((trip) => trip.tripId === parseInt(tripId));

    if (
      !trip ||
      trip.invitationLink !== `https://example.com/invite?code=${code}`
    ) {
      return res.status(400).send({ error: "Invalid invitation link" });
    }

    res.send({ tripId, invitationCode: code });
  });
});

app.post("/api/trips/:tripId/accept-invitation", (req, res) => {
  const { tripId } = req.params;
  const { username, password } = req.body;

  fs.readFile("users.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: "Error reading users.json" });
    }

    const users = JSON.parse(data);
    const user = users.find((user) => user.username === username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).send({ error: "Invalid username or password" });
    }

    fs.readFile(`${__dirname}/trip.json`, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ error: "Error reading trip.json" });
      }

      const trips = JSON.parse(data);
      const tripIndex = trips.findIndex(
        (trip) => trip.tripId === parseInt(tripId)
      );

      if (tripIndex === -1) {
        return res
          .status(404)
          .send({ error: `Trip with ID ${tripId} not found` });
      }

      const tripMembers = trips[tripIndex].tripMembers;
      const existingMember = tripMembers.find(
        (member) => member.email === user.email
      );

      if (existingMember) {
        return res.status(400).send({
          error: `User with email ${user.email} is already a trip member`,
        });
      }

      tripMembers.push({ name: user.name, email: user.email, invited: false });
      trips[tripIndex].tripMembers = tripMembers;

      fs.writeFile(`${__dirname}/trip.json`, JSON.stringify(trips), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: "Error writing to trip.json" });
        }
        res.send({ message: `User ${user.name} added to trip ${tripId}` });
      });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
