const httpStatus = require("http-status");
const Job = require("./job.model");
const { JOB_STATUS } = require("../../utils/constants");

const createJob = async (payload, currentUser) => {
    const job = await Job.create({
        title: payload.title,
        description: payload.description,
        company: payload.company || currentUser.company,
        location: payload.location,
        salary: payload.salary,
        employmentType: payload.employmentType,
        status: JOB_STATUS.OPEN,
        postedBy: currentUser.id
    });
    return job;
};

const getJobs = async filters => {
    const query = {};

    if (filters.company) { query.company = filters.company };
    if (filters.status) { query.status = filters.status };

    return Job.find(query)
        .populate("postedBy", "name email company role")
        .sort("-createdAt") // descending order new post will be in top.
};

const getJobById = async jobId => {
    const job = await Job.findById(jobId).populate(
        "postedBy",
        "name email company"
    );

    if (!job) {
        const err = new Error("Job is not found");
        err.statusCode = httpStatus.NOT_FOUND;
        throw err;
    }

    return job;
}

const getMyJobs = async currentUser => {
    const jobs = await Job.find({ postedBy: currentUser.id }).sort('-createdAt');
    return jobs;
    // return (await Job.find({postedBy:currentUser.id})).sort("-createdAt");
};

const updateJob = async (jobId , payload, currentUser) => {
    // payload = req.body
    const job = await Job.findById(jobId);
    if(!job){
        const err = new Error("Job is not found")
        err.statusCode = httpStatus.NOT_FOUND;
        throw err;
    }

    if(currentUser.role !== "admin" && job.postedBy.toString() !== currentUser.id) {
        const err = new Error("You can update only your own jobs");
        err.statusCode = httpStatus.FORBIDDEN;
        throw err;
    }

    Object.assign(job,payload);
    await job.save();
    return job;
}


const deleteJob = async (jobId, currentUser) =>{
    const job = await Job.findById(jobId);
    if(!job){
        const err = new Error("Job not found");
        err.statusCode = httpStatus.NOT_FOUND;
        throw err;
    };

    if(
        currentUser.role !== "admin" && 
        job.postedBy.toString() !== currentUser.id
    ){
        const err = new Error("You can delete only your own jobs");
        err.statusCode = httpStatus.FORBIDDEN;
        throw err;
    }

    await job.deleteOne();
    return job;
};

module.exports = {
    createJob,
    getJobs,
    getJobById,
    getMyJobs,
    updateJob,
    deleteJob
}