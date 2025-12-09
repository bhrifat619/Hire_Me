const mongoose = require("mongoose");
const { APPLICATION_STATUS, PAYMENT_STATUS } = require("../../utils/constants")

const invoiceSchema = new mongoose.Schema(
    {
        transactionId: String,
        amount: Number,
        currency: {
            type: String,
            default: "BDT"
        },
        paidAt: Date
    },
    { _id: false }
);

const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        resumeUrl: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: Object.values(APPLICATION_STATUS),
            default: APPLICATION_STATUS.PENDING
        },
        paymentStatus: {
            type: String,
            enum: Object.values(PAYMENT_STATUS),
            default: PAYMENT_STATUS.PENDING
        },
        invoice: invoiceSchema
    },
    {
        timestamps: true
    }
);

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

const Application = mongoose.model("Application",applicationSchema);

module.exports = Application;