const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require("./utils/appError");
const globalErrorhandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const donationRouter = require("./routes/donationRouter");

const app = express();

//Security middleware
app.use(helmet());

//Request logging in dev mode
if (process.env.NODE_ENV === 'devlopment') {
    app.use(morgan('dev'));
}

//Limiting the req
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many Requests from this IP, please try again later'
});
app.use('/api', limiter);

//Body parser
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution from dup param
app.use(hpp());

app.use('/user', userRouter);
app.use('/donate', donationRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this Server!`, 404));
});

app.use(globalErrorhandler);

module.exports = app;