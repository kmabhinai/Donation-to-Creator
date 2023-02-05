const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Donation = require('./../models/donationModel');
const User = require("./../models/userModels");

let sendRequest = (res, status, obj) => {
    res.status(status).json({
        status: "Success",
        data: {
            document: obj
        }
    });
};

exports.createDonation = catchAsync(async (req, res, next) => {
    let fromUserName = req.user.id;
    let toUserName = await User.findOne({ username: req.body.to });

    if (!fromUserName || !toUserName) return next(new AppError("Please Enter the correct Username of the creator", 400));
    if (toUserName.role != 'creator') return next(new AppError("You can only donate to a creator", 400));

    const newDonation = await Donation.create({
        from: fromUserName,
        to: toUserName.id,
        currency: req.body.currency,
        amount: req.body.amount,
        name: req.body.name,
        message: req.body.message
    });

    sendRequest(res, 200, newDonation);
});

exports.getDonatedToUser = catchAsync(async (req, res, next) => {
    let toUser = await User.findOne({ username: req.body.to });
    if (!toUser) next(new AppError("Please enter the valid creator username", 400));
    let donations = await Donation.find({ from: req.user.id, to: toUser.id });

    sendRequest(res, 200, donations);
});