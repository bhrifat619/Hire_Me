const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../../config");
const { ROLES } = require("../../utils/constants");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false
        },
        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.JOB_SEEKER
        },
        company: {
            type: String // role recruiter hole use hobe
        },
        phone: String,
        isActive: {
            type: Boolean,
            default: true
        },
        refreshToken: {
            type: String,
            select: false
        }
    },
    { timestamps: true }
);

userSchema.pre("save", async function () {
    // If password is not modified, do nothing
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(config.bcryptSaltRounds);
    this.password = await bcrypt.hash(this.password, salt);
});  // no "next" param, no next()
// userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next();

//     const salt = await bcrypt.genSalt(config.bcryptSaltRounds)
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });  // save korar age pass hash 

userSchema.methods.comparePassword = async function (plainPass) {
    return bcrypt.compare(plainPass, this.password);
}; // compare kora, login er khetre

const User = mongoose.model("User", userSchema);
module.exports = User;