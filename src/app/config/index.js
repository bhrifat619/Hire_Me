const path = require("path")
require("dotenv").config({ path: path.join(process.cwd(), ".env") });

module.exports = {
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 5000,
    dbURI: process.env.DB_URI,
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
        refreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    },
    bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
    applicationFee: Number(process.env.APPLICATION_Fee) || 100
};