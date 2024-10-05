const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');

router.post('/recommend', async (req, res) => {
  try {
    const userProfile = req.body;

    // Save user profile to database
    const user = new User(userProfile);
    await user.save();

    // Get job recommendations
    const recommendations = await getJobRecommendations(userProfile);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

async function getJobRecommendations(userProfile) {
  const { skills, experience_level, preferences } = userProfile;

  // Find all jobs matching the experience level and job type
  const jobs = await Job.find({
    experience_level: experience_level,
    job_type: preferences.job_type
  });

  // Score jobs based on matching criteria
  const scoredJobs = jobs.map(job => {
    let score = 0;
    
    // Score based on matching skills (3 points per skill)
    const matchingSkills = job.required_skills.filter(skill => skills.includes(skill));
    score += matchingSkills.length * 2;

    // Score based on desired roles (4 points)
    if (preferences.desired_roles.includes(job.job_title)) {
      score += 4;
    }

    // Score based on location preference (2 points)
    if (preferences.locations.includes(job.location) || job.location === 'Remote') {
      score += 1;
    }

    return { job, score };
  });

  // Find the maximum score
  const maxScore = Math.max(...scoredJobs.map(job => job.score));

  // Filter jobs with the maximum score
  const topJobs = scoredJobs
    .filter(job => job.score === maxScore)
    .map(({ job }) => ({
      job_title: job.job_title,
      company: job.company,
      location: job.location,
      job_type: job.job_type,
      required_skills: job.required_skills,
      experience_level: job.experience_level
    }));

  // Return up to 2 top jobs
  return topJobs.slice(0, 2);
}

module.exports = router;