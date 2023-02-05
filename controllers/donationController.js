const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Donation = require('./../models/donationModel');
const User = require("./../models/userModels");

exports.createDonation = catchAsync(async (req, res, next) => {
    let fromUserName = req.user.id;
    let toUserName = await User.findOne({ username: req.body.to });

    if (!fromUserName || !toUserName) return next(new AppError("Please Enter the correct Usernames", 400));
    if (toUserName.role != 'creator') return next(new AppError("You can only donate to a creator", 400));

    const newDonation = await Donation.create({
        from: fromUserName,
        to: toUserName.id,
        currency: req.body.currency,
        amount: req.body.amount,
        name: req.body.name,
        message: req.body.message
    });

    res.status(200).json({
        status: "Success",
        data: {
            newDonation
        }
    });
});