const bcrypt = require("bcrypt");
const crypto = require("crypto");

const express = require("express");
const session = require("express-session");

const app = express();
const port = 5000;

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
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  // Authenticate user here by checking their credentials against your user database
  const user = await User.findOne({ username });
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  // Set a session cookie with the authenticated user's ID
  req.session.userId = user.id;
  res.json({ success: true, user });
});

app.post("/api/trips", (req, res) => {
  const data = req.body;
  console.log(data);
  res.send("Data received successfully");
});
app.get("/api/trips", (req, res) => {
  const data = req.body;
  res.send("Get Something");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
