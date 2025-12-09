const jwt = require("jsonwebtoken")
const config = require("../config") // error case maybe

const generateAccessToken = payload => {
    return jwt.sign(
        payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn
    }
    )
};
const generateRefreshToken = payload => {
    return jwt.sign(payload, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn
    });
};

module.exports = { generateAccessToken, generateRefreshToken };

// all done