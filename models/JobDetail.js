const mongoose = require('mongoose');

const JobDetailSchema = new mongoose.Schema({
  job_id: Number,
  description: String,
  salary_range: String,
  application_deadline: Date
});

module.exports = mongoose.model('JobDetail', JobDetailSchema);