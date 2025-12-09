const httpStatus = require("http-status");

const notFound = (req,res,next) =>{
    res.status(httpStatus.NOT_FOUND).json({
        success:false,
        message: "api endpoint not found check your request properly."
    });
};

module.exports=notFound;