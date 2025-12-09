const httpStatus = require("http-status");
const Application = require("./application.model");
const Job = require("../job/job.model");
const {
    APPLICATION_STATUS,
    PAYMENT_STATUS,
    ROLES,
    JOB_STATUS
} = require("../../utils/constants");
const { processPayment } = require("../../utils/paymentGateway");
const config = require("../../config")

const applyForJob = async ({ jobId, resumePath, currentUser }) => {
    if (currentUser.role !== ROLES.JOB_SEEKER) {
        const err = new Error("Only job seekers can apply for the jobs.");
        err.statusCode = httpStatus.FORBIDDEN;
        throw err;
    }

    const job = await Job.findById(jobId);
    if (!job || job.status !== JOB_STATUS.OPEN) {
        const err = new Error("Job is not available for application.");
        err.statusCode = httpStatus.FORBIDDEN
        throw err;
    }
    const existing = await Application.findOne({
        job: jobId,
        applicant: currentUser.id
    });
    if (existing) {
        const err = new Error("You have already applied for the job.");
        err.statusCode = httpStatus.BAD_REQUEST;
        throw err;
    }

    // mock payment
    const payment = await processPayment({
        amount: config.applicationFee,
        currency: "BDT",
        userID: currentUser.id
    });

    if (payment.status !== "succeeded") {
        const err = new Error("Payment failed. Try again.")
        err.statusCode = httpStatus.BAD_REQUEST
        throw err
    }

    const application = await Application.create({
        job: jobId,
        applicant: currentUser.id,
        resumeUrl: resumePath,
        status: APPLICATION_STATUS.PENDING,
        paymentStatus: PAYMENT_STATUS.PAID,
        invoice: {
            transactionId: payment.id,
            amount: payment.amount,
            currency: payment.currency,
            paidAt: payment.paidAt
        }
    });
    return application;
};

const getMyApplications = async currentUser => {
    return Application.find({ applicant: currentUser.id })
        .populate("job", "title company location")
        .sort("-createdAt")
};

const getApplicationsForJob = async (jobId, currentUser) => {
    const job = await Job.findById(jobId);
    if (!job) {
        const err = new Error("Job not found");
        err.statusCode = httpStatus.NOT_FOUND
        throw err
    }
    if (currentUser.role !== ROLES.ADMIN && job.postedBy.toString() !== currentUser.id) {
        const err = new Error("You can view applications only for your own jobs");
        err.statusCode = httpStatus.FORBIDDEN;
        throw err;
    }
    return Application.find({ job: jobId })
        .populate("applicant", "name email")
        .sort("-createdAt");
};

const updateApplicationStatus = async (appId, status, currentUser) => {
    if (
        ![APPLICATION_STATUS.ACCEPTED, APPLICATION_STATUS.REJECTED].includes(status)
    ) {
        const err = new Error("Status must be accepted or rejected");
        err.statusCode = httpStatus.BAD_REQUEST;
        throw err;
    }

    const application = await Application.findById(appId).populate("job");
    if (!application) {
        const err = new Error("Application not found")
        err.statusCode = httpStatus.NOT_FOUND
        throw err;
    }
    if (currentUser.role !== ROLES.ADMIN && application.job.postedBy.toString() !== currentUser.id) {
        const err = new Error("You can manage application only for your own jobs")
        err.statusCode = httpStatus.FORBIDDEN;
        throw err
    }

    application.status = status;
    await application.save();
    return application;
};

const getAllApplications = async filters => {
    const query = {};
    if (filters.status) {query.status = filters.status};

    const apps = await Application.find(query)
        .populate({
            path: 'job',
            select: 'title company location',
            match: filters.company ? { company: filters.company } : {}
        })
        .populate('applicant', 'name email')
        .sort('-createdAt');

    if (filters.company) {
        // remove docs where job didn't match company filter
        return apps.filter(app => app.job);
    }

    return apps;
};

module.exports = {
    applyForJob,
    getMyApplications,
    getApplicationsForJob,
    updateApplicationStatus,
    getAllApplications
};