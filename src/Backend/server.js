const express = require('express');
const app = express();
const port = 5000; 

// Middleware to parse request bodies
app.use(express.json());
const cors = require('cors');
app.use(cors());
// Define a route to handle the incoming data
app.post('/api/trips', (req, res) => {
  const data = req.body; 
  console.log(data)
  res.send('Data received successfully');
});
app.get('/api/trips', (req, res) => {
    const data = req.body; 
    res.send('Get Something');
  });

  // Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });


