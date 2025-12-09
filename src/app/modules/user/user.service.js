const httpStatus = require("http-status");
const User = require("./user.model");
const { generateToken } = require("../../utils/tokenGenerator")
const { ROLES, ADMIN_MAIL } = require("../../utils/constants");
const {
    generateAccessToken,
    generateRefreshToken
} = require('../../utils/tokenGenerator');
const registerUser = async payload => {
    const existing = await User.findOne({ email: payload.email });
    if (existing) {
        const err = new Error("Email already registered");
        err.statusCode = httpStatus.BAD_REQUEST;
        throw err;
    }

    // for reqruitier and job_seeker
    // const role = payload.role === ROLES.RECRUITER ? ROLES.RECRUITER : ROLES.JOB_SEEKER;
    let role = ROLES.JOB_SEEKER;

    // this email is always admin
    if (payload.email === ADMIN_MAIL) {
        role = ROLES.ADMIN;
    } else if (payload.role === ROLES.RECRUITER) {
        role = ROLES.RECRUITER;
    }

    const user = await User.create({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role,
        company: role === ROLES.RECRUITER ? payload.company : undefined,
        phone: payload.phone
    });
    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

    user.refreshToken = refreshToken;
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return { user: userObj, accessToken, refreshToken };
};

const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        const err = new Error("Invalid credentials");
        err.statusCode = httpStatus.UNAUTHORIZED;
        throw err;
    }

    if (user.email === ADMIN_MAIL && user.role !== ROLES.ADMIN) {
        user.role = ROLES.ADMIN;
        await user.save();
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
        const err = new Error("Invalid credentials")
        err.statusCode = httpStatus.UNAUTHORIZED;
        throw err;
    }


    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

    user.refreshToken = refreshToken;
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;
    return { user: userObj, accessToken, refreshToken }
};

// ---------- refresh token ----------
const refreshAccessToken = async providedRefreshToken => {
    if (!providedRefreshToken) {
        const err = new Error('Refresh token is required');
        err.statusCode = 400;
        throw err;
    }

    let decoded;
    try {
        decoded = jwt.verify(
            providedRefreshToken,
            config.jwt.refreshSecret
        ); // throws if invalid/expired
    } catch (e) {
        const err = new Error('Invalid or expired refresh token');
        err.statusCode = 401;
        throw err;
    }

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || !user.refreshToken) {
        const err = new Error('Refresh token not found');
        err.statusCode = 401;
        throw err;
    }

    if (user.refreshToken !== providedRefreshToken) {
        const err = new Error('Refresh token mismatch');
        err.statusCode = 401;
        throw err;
    }

    // issue new pair (rotate refresh token)
    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const newRefreshToken = generateRefreshToken({ id: user.id, role: user.role });

    user.refreshToken = newRefreshToken;
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return { user: userObj, accessToken, refreshToken: newRefreshToken };
};

// ---------- logout ----------
const logoutUser = async userId => {
    const user = await User.findById(userId).select('+refreshToken');
    if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }

    user.refreshToken = null; // or ''
    await user.save();

    return;
};
const createAdminUser = async payload => {
    const existing = await User.findOne({ email: payload.email });
    if (existing) {
        const err = new Error('Email already registered');
        err.statusCode = 400;
        throw err;
    }

    const user = await User.create({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: ROLES.ADMIN,
        phone: payload.phone
    });

    return user.toObject();
};

const getProfile = async userId => {
    const user = await User.findById(userId).select("-password");
    if (!user) {
        const err = new Error("User not found");
        err.statusCode = httpStatus.NOT_FOUND;
        throw err;
    }
    return user;
}

const getAllUsers = async filters => {
    const query = {};

    if (filters.role) {
        query.role = filters.role;
    }
    if (filters.company) {
        query.company = filters.company;
    }
    return User.find(query).select("-password");
}

const updateUser = async (userId, payload) => {
    delete payload.password;
    const user = await User.findByIdAndUpdate(userId, payload, {
        new: true
    }).select("-password")
    if (!user) {
        const err = new Error("User not found");
        err.statusCode = httpStatus.NOT_FOUND;
        throw err;
    }
    return user;
};

const deleteUser = async userId => {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        const err = new Error("User not found")
        err.statusCode = httpStatus.NOT_FOUND;
        throw err;
    }
    return user;
};

module.exports = {
    registerUser,
    loginUser,
    refreshAccessToken,
    createAdminUser,
    getProfile,
    getAllUsers,
    updateUser,
    deleteUser,
    logoutUser
};

// all done next usercontroller.