const mongoose = require('mongoose');
const User = require('./userModels');

const donationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: [true, 'Donar User Id is required']
    },
    to: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: [true, 'Receiver User Id is required']
    },
    currency: {
        type: String,
        required: [true, "Please Mention the currency"]
    },
    amount: {
        type: Number,
        required: [true, "Please Mention the amount"]
    },
    name: String,
    message: String
});

donationSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'from',
        select: 'username'
    }).populate({
        path: 'to',
        select: 'username'
    });
    next();
});

const Donation = mongoose.model('Donation', donationSchema);
module.exports = Donation;