const User = require("./../models/userModels");
let catchAsync = require("./../utils/catchAsync");

exports.getCreators = catchAsync(async (req, res, next) => {
    const page = (req.query.page * 1) || 1;
    const limit = (req.query.limit * 1) || 10;
    const skipVal = (page - 1) * limit;
    let creators = await User.find({ role: "creator" }).skip(skipVal).limit(limit);
    res.status(200).json({
        status: "Success",
        page: page,
        limit: limit,
        data: {
            creators
        }
    });
});