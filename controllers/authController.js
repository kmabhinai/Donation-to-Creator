const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModels");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const { sign } = require("crypto");

const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_ID
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    res.status(statusCode).json({
        status: "Success",
        token,
        data: {
            user
        }
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        role: req.body.role,
        profileURL: req.body.profileURL,
    });
    createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { username, password } = req.body;

    //Chk if username and password exist
    if (!username || !password) {
        return next(new AppError('Please provide Username and Password!!', 400));
    }

    //Check if id and pw is correct
    const user = await User.findOne({ username: username }).select('+password');  //or {username}

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect Username or Password!!', 401));
    }

    user.password = undefined;
    createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
    // Getting token and check of it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
        return next(new AppError('The User belonging to this token no longer exist!!!'));
    }

    //Grant access to protected route
    req.user = freshUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You don't have permission to this action", 403));
        }

        next();
    };
};
