const express = require("express");
const auth = require("../../middleware/auth");
const { ROLES } = require("../../utils/constants");

const {
    createJob,
    getJobs,
    getJobById,
    getMyJobs,
    updateJob,
    deleteJob
} = require("./job.controller");

const router = express.Router();

router.get("/", getJobs);
router.get("/:id", getJobById);

router.post("/", auth(ROLES.RECRUITER, ROLES.ADMIN), createJob);
router.get("/mine/list", auth(ROLES.RECRUITER, ROLES.ADMIN), getMyJobs);

router.patch("/:id", auth(ROLES.RECRUITER, ROLES.ADMIN), updateJob);
router.delete("/:id", auth(ROLES.RECRUITER, ROLES.ADMIN), deleteJob);

module.exports = router;