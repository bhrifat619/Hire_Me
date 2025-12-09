const multer = require("multer");
const path = require("path");
const httpStatus = require("http-status");

const fs = require('fs');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'uploads', 'cv');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, "uploads/cv");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, name);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docs eta
        "application/msword" 
    ];

    if (!allowedMimTypes.includes(file.mimetype)) {
        const err = new Error("Give a valid file like PDF , DOC and DOCX")
        err.statusCode = httpStatus.BAD_REQUEST;
        return cb(err);
    }

    cb(null, true)

};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter
});

module.exports = upload;