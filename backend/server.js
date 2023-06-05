const bcrypt = require("bcrypt");
const crypto = require("crypto");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const fs = require('fs');

const app = express();
const port = 8080;

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

app.use(express.json());

const cors = require("cors");
app.use(cors());

// Define a route to handle the incoming data
// testuser : password123
const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const mockUser = {
  id: 1,
  username: "testuser",
  password: "password123", // -> need to hash password: 'password123', but to simplify the things, just let it like this
};
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (username !== mockUser.username) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid username" });
  }

  // const passwordMatch = await bcrypt.compare(password, mockUser.password);
  const passwordMatch = mockUser.password === password;
  if (!passwordMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid password" });
  }

  req.session.userId = mockUser.id; // Store the user ID in the session
  res.cookie("sessionId", req.session.id, {
    httpOnly: true,
    secure: false, // Set to true if using HTTPS
    sameSite: "strict",
    maxAge: 3600000, // 1 hour
  });
  console.log("Session ID:", req.session.id); // Log the session ID
  // console.log("Session Cookie:", req.cookies.sessionId); // Log the sess
  res.json({ success: true, session: { sessionId: req.session.id } });
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
