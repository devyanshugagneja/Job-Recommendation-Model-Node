const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', apiRoutes);

// Sample data insertion (you can remove this after inserting the data once)
const Job = require('./models/Job');
const sampleJobs = [

  ];

async function insertSampleData() {
  try {
    await Job.insertMany(sampleJobs);
    console.log('Sample job data inserted successfully');
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
}

insertSampleData();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));