const express = require("express");
const {
    register,
    login,
    getMe,
    getUsers,
    updateUser,
    deleteUser,
    createAdmin,
    refreshToken,
    logout } = require("./user.controller");

const auth = require("../../middleware/auth");
const { ROLES } = require("../../utils/constants");

const router = express.Router();

router.post("/register", register); 
router.post("/login", login);
router.post('/refresh-token', refreshToken);
router.post('/logout', auth(), logout); 

router.get("/me", auth(), getMe);

router.post("/admin", auth(ROLES.ADMIN), createAdmin)


router.get("/", auth(ROLES.ADMIN), getUsers);
router.patch("/:id", auth(ROLES.ADMIN), updateUser);
router.delete("/:id", auth(ROLES.ADMIN), deleteUser);

module.exports = router;