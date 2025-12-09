const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const jobService = require("./job.service");

const createJob = catchAsync(async (req, res) => {
    const job = await jobService.createJob(req.body, req.user);

    res.status(httpStatus.CREATED).json({
        success: true,
        message: "job created successfully",
        data: job
    });
});

const getJobs = catchAsync(async (req, res) => {
    const jobs = await jobService.getJobs(req.query);
    res.status(httpStatus.OK).json({
        success: true,
        data: jobs
    });
});

const getJobById = catchAsync(async (req, res) => {
    const job = await jobService.getJobById(req.params.id);
    res.status(httpStatus.OK).json({
        success: true,
        data: job
    });
});

const getMyJobs = catchAsync(async (req, res) => {
    const jobs = await jobService.getMyJobs(req.user);

    res.status(httpStatus.OK).json({
        success: true,
        data: jobs
    });
});

const updateJob = catchAsync(async (req, res) => {
    const job = await jobService.updateJob(req.params.id, req.body, req.user);
    res.status(httpStatus.OK).json({
        success: true,
        message: "job updated successfully",
        data: job
    });
});

const deleteJob = catchAsync(async (req, res) => {
    await jobService.deleteJob(req.params.id, req.user);
    res.status(httpStatus.OK).json({
        success: true,
        message: "Job deleted successfully"
    });
});

module.exports = {
    createJob,
    getJobs,
    getJobById,
    getMyJobs,
    updateJob,
    deleteJob
};