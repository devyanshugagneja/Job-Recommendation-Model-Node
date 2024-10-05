const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('YOUR MONGO DB LINK', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
