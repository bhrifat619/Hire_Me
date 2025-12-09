const mongoose = require("mongoose");
const { JOB_STATUS } = require("../../utils/constants");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        company: {
            type: String,
            required: true
        },
        location: String,
        salary: String,
        employmentType: {
            type: String,
            enum: ["full-time", "part-time", "contract", "internship"],
            default: "full-time"
        },
        status: {
            type: String,
            enum: Object.values(JOB_STATUS),
            default: JOB_STATUS.OPEN
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
)

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;

// all done here