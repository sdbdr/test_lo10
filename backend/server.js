const bcrypt = require("bcrypt");
const crypto = require("crypto");
const express = require("express");
const session = require("express-session");
const fs = require('fs');

const app = express();
const port = 8080;

const generateSessionSecret = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Middleware to parse request bodies
app.use(
  session({
    secret: generateSessionSecret(),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(express.json());

const cors = require("cors");
app.use(cors());

// Define a route to handle the incoming data
// testuser : password123
const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

const mockUser = {
  id: 1,
  username: "testuser",
  password: "password123", // -> need to hash password: 'password123', but to simplify the things, just let it like this
};
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (username !== mockUser.username) {
    console.log("Username failed")
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }
  
  // const passwordMatch = await bcrypt.compare(password, mockUser.password);
  const passwordMatch = password === mockUser.password;
  if (!passwordMatch) {
    console.log("pass failed")
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }
  req.session.userId = mockUser.id;
  res.json({ success: true, user: mockUser });
});



app.post("/api/trips", (req, res) => {
  const data = req.body;
  console.log(data);
  addTrip(data);
  res.send("Data received successfully");
});



app.get("/api/trips/:id", (req, res) => {  
  const trips=require("./trip.json");
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



app.get("/api/trips/", (req, res) => {  
  const trips=require("./trip.json");
  const id = req.params.id;   
     res.json(trips);
   
});




// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




const addTrip=(data)=>{
const trips=require("./trip.json");
trips.push(data);
const updatedTrips=JSON.stringify(trips,null,2);
fs.writeFileSync("./trip.json",updatedTrips);
}
