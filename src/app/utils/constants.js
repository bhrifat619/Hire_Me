const ROLES = {
    ADMIN :"admin",
    RECRUITER: "recruiter",
    JOB_SEEKER :"job_seeker"
};

const JOB_STATUS ={
    OPEN :"open",
    CLOSED: "closed"
};

const APPLICATION_STATUS ={
    PENDING :"pending",
    ACCEPTED:"accepted",
    REJECTED:"rejected"
};

const PAYMENT_STATUS ={
    PENDING:"pending",
    PAID:"paid",
    FAILED:"failed"
}

const ADMIN_MAIL  = "admin@gmail.com"

module.exports={
    ROLES,
    JOB_STATUS,
    APPLICATION_STATUS,
    PAYMENT_STATUS,
    ADMIN_MAIL
};

// all done