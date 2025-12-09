const express = require('express');
const auth = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const { ROLES } = require('../../utils/constants');
const {
    applyForJob,
    getMyApplications,
    getApplicationsForJob,
    updateApplicationStatus,
    getAllApplications
} = require('./application.controller');

const router = express.Router();

router.post(
    '/',
    auth(ROLES.JOB_SEEKER),
    upload.single('cv'),
    applyForJob
);

router.get('/my', auth(ROLES.JOB_SEEKER), getMyApplications);

router.get('/', auth(ROLES.ADMIN), getAllApplications);

router.get(
    '/job/:jobId',
    auth(ROLES.RECRUITER, ROLES.ADMIN),
    getApplicationsForJob
);

router.patch(
    '/:id/status',
    auth(ROLES.RECRUITER, ROLES.ADMIN),
    updateApplicationStatus
);

module.exports = router;