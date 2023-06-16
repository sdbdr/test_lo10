const fs = require("fs");

const addTrip = (data) => {
  const trips = require(`${__dirname}/../data/trip.json`);
  trips.push(data);
  const updatedTrips = JSON.stringify(trips, null, 2);
  fs.writeFileSync(`${__dirname}/../data/trip.json`, updatedTrips);
};

const updateTrips = (updatedTrips) => {
  const trips = JSON.stringify(updatedTrips, null, 2);
  fs.writeFile(`${__dirname}/../data/trip.json`, trips, (err) => {
    if (err) {
      console.error("Error writing to trip.json:", err);
    } else {
      console.log("Trips data updated and written to trip.json:");
    }
  });
};

const generateInvitationCode = () => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += characters[Math.floor(Math.random() * characters.length)];
  }
  return code;
};

class TripController {
  getTrips(req, res) {
    fs.readFile(`${__dirname}/../data/trip.json`, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ error: "Error reading trip.json" });
      }
      const trips = JSON.parse(data);
      res.send(trips);
    });
  }

  getTripById(req, res) {
    fs.readFile(`${__dirname}/../data/trip.json`, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .send({ error: "Error reading trip.json " + err });
      }

      const trips = JSON.parse(data);
      const id = req.params.id;
      if (id) {
        const trip = trips.find((trip) => trip.tripId === id);
        if (trip) {
          res.json(trip);
        } else {
          res.status(404).send("Trip not found");
        }
      }
    });
  }

  createTrip(req, res) {
    const {
      tripId,
      tripName,
      startDate,
      endDate,
      period,
      city,
      description,
      budget,
      tripMembers,
      tripPlans,
      tripTasks,
    } = req.body;

    fs.readFile(`${__dirname}/../data/trip.json`, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ error: "Error reading trip.json" });
      }

      const invitationLink = `http://localhost:3000/invite?code=${generateInvitationCode()}`;
      const newTrip = {
        tripId,
        tripName,
        startDate,
        endDate,
        period,
        city,
        description,
        budget,
        tripMembers,
        tripPlans,
        tripTasks,
        invitationLink,
      };
      console.log("new trip", newTrip);

      const trips = JSON.parse(data);
      trips.push(newTrip);

      fs.writeFile(
        `${__dirname}/../data/trip.json`,
        JSON.stringify(trips, null, 2),
        (err) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .send({ error: "Error writing to trip.json" });
          }
        }
      );
    });

    res.send("Data received successfully");
  }

  updateTrip(req, res) {
    const trips = require(`${__dirname}/../data/trip.json`);
    const id = req.params.id;
    const data = req.body;
    if (id) {
      if (!trips.find((trip) => trip.tripId === id)) {
        const newTrip = { tripId: id, ...data };
        addTrip(newTrip);
        res.send("Data received successfully");
        return;
      }
    }
    const updatedTrips = trips.map((trip) => {
      if (trip.tripId === id) {
        return { tripId: id, ...data };
      }
      return trip;
    });
    updateTrips(updatedTrips);
    res.send(updatedTrips);
  }

  sendInvitation(req, res) {
    const { tripId } = req.params;
    const { email } = req.body;

    fs.readFile(`${__dirname}/../data/trip.json`, "utf8", (err, data) => {
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
        return res.status(400).send({
          error: `Member with email ${email} is already a trip member`,
        });
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

      updateTrips(trips);

      res.send({ message: `Invitation sent to ${email}` });
    });
  }

  validateInvitationLink(req, res) {
    const { tripId, code } = req.params;

    fs.readFile(`${__dirname}/../data/trip.json`, "utf8", (err, data) => {
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
  }
}

module.exports = TripController;
