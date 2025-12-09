const express = require('express');
const userRoutes = require('../modules/user/user.route');
const jobRoutes = require('../modules/job/job.route');
const applicationRoutes = require('../modules/application/application.route');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);

module.exports = router;