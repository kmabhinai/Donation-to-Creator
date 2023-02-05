const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Donar User Id is required']
    },
    to: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
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
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

donationSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'to'
    });
    next();
});

const Donation = mongoose.model('Donation', donationSchema);
module.exports = Donation;