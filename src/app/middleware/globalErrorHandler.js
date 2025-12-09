const httpStatus = require("http-status");

const globalErrorHandler = (err, req, res, next) => {
    console.error("error from global error handler ", err);

    const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || "Something went wrong..";

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV = "development" ? err.stack : "undefined"
    });
};

module.exports = { globalErrorHandler};