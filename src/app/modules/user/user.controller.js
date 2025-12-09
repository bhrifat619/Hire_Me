const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync")
const userService = require("./user.service");
const { ADMIN_MAIL } = require("../../utils/constants");

const register = catchAsync(async (req, res) => {
    const result = await userService.registerUser(req.body);

    res.status(httpStatus.CREATED).json({
        success: true,
        message: "user registered successfully",
        data: result
    });
});

const login = catchAsync(async (req, res) => {
    const result = await userService.loginUser(req.body);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Logged in successfully",
        data: result
    })
});

const logout = catchAsync(async (req, res) => {
    await userService.logoutUser(req.user.id);

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});

const getMe = catchAsync(async (req, res) => {
    const profile = await userService.getProfile(req.user.id);

    res.status(httpStatus.OK).json({
        success: true,
        data: profile
    });
});

const getUsers = catchAsync(async (req, res) => {
    const users = await userService.getAllUsers(req.query);

    res.status(httpStatus.OK).json({
        success: true,
        data: users
    });
});

const updateUser = catchAsync(async (req, res) => {
    const user = await userService.updateUser(req.params.id, req.body);

    res.status(httpStatus.OK).json({
        success: true,
        message: "User updated successfully",
        data: user
    });
});

const deleteUser = catchAsync(async (req, res) => {
    await userService.deleteUser(req.params.id);
    res.status(httpStatus.OK).json({
        success: true,
        message: "User deleted successfully"
    });
});

const createAdmin = catchAsync(async (req, res) => {
    if (req.user.email !== ADMIN_MAIL) {
        const err = new Error("Only Admin can create admins")
        err.statusCode = 403;
        throw err;
    }
    const user = await userService.createAdminUser(req.body);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Admin created successfully",
        data: user
    });
});

const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.body;

    const result = await userService.refreshAccessToken(refreshToken);

    res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: result
    });
});


module.exports = {
    register,
    login,
    getMe,
    getUsers,
    updateUser,
    deleteUser,
    createAdmin,
    refreshToken,
    logout
};