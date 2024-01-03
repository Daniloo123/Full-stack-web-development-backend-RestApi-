// Import the express module
import express from 'express';

// Create an Express application
const app = express();

// Define a route that responds with "Hello, World!"
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Set the server to listen on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});