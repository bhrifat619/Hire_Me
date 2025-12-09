const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const config = require("../config");
const User = require("../modules/user/user.model");
const catchAsyc = require("../utils/catchAsync");

const auth = (...requiredRoles) => catchAsyc(async (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        const err = new Error("You are not logged in");
        err.statusCode = httpStatus.UNAUTHORIZED;
        throw err;
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, config.jwt.secret);

    const user = await User.findById(decoded.id);
    if (!user) {
        const err = new Error("User no longer exist.")
        err.statusCode = httpStatus.UNAUTHORIZED;
        throw err;
    }

    if (requiredRoles.length && !requiredRoles.includes(user.role)) {
        const err = new Error("You do not have permission to access this.")
        err.statusCode = httpStatus.FORBIDDEN;
        throw err;
    }

    req.user = {
        id: user.id,
        role: user.role,
        email: user.email,
        name: user.name,
        company: user.company
    };

    next();

});

module.exports = auth;

// all done here