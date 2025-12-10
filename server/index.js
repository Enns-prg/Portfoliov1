const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config(); // Load .env vars
const connectDB = require('./config/db');

const app = express();
const port = process.env.PORT || 5000;

// 1. Connect to Database
connectDB();

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Test Route (The "Hello World" of APIs)
app.get('/api/test', (req, res) => {
  res.json({ message: "Hello from the Server! 🚀" });
});

// 4. Start Server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});