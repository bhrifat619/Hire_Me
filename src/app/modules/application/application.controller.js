const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const applicationService = require('./application.service');

const applyForJob = catchAsync(async (req, res) => {
    const { jobId } = req.body;

    if (!jobId) {
        const err = new Error('jobId is required');
        err.statusCode = httpStatus.BAD_REQUEST;
        throw err;
    }

    if (!req.file) {
        const err = new Error('CV file is required');
        err.statusCode = httpStatus.BAD_REQUEST;
        throw err;
    }

    const application = await applicationService.applyForJob({
        jobId,
        resumePath: req.file.path,
        currentUser: req.user
    });

    res.status(httpStatus.CREATED).json({
        success: true,
        message: 'Application submitted successfully',
        data: application
    });
});

const getMyApplications = catchAsync(async (req, res) => {
    const apps = await applicationService.getMyApplications(req.user);

    res.status(httpStatus.OK).json({
        success: true,
        data: apps
    });
});

const getApplicationsForJob = catchAsync(async (req, res) => {
    const apps = await applicationService.getApplicationsForJob(
        req.params.jobId,
        req.user
    );

    res.status(httpStatus.OK).json({
        success: true,
        data: apps
    });
});

const updateApplicationStatus = catchAsync(async (req, res) => {
    const { status } = req.body;

    const app = await applicationService.updateApplicationStatus(
        req.params.id,
        status,
        req.user
    );

    res.status(httpStatus.OK).json({
        success: true,
        message: 'Application status updated',
        data: app
    });
});

const getAllApplications = catchAsync(async (req, res) => {
    const apps = await applicationService.getAllApplications(req.query);

    res.status(httpStatus.OK).json({
        success: true,
        data: apps
    });
});

module.exports = {
    applyForJob,
    getMyApplications,
    getApplicationsForJob,
    updateApplicationStatus,
    getAllApplications
};