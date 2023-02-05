const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    username: {
        type: String,
        required: [true, "Username is Required"],
        unique: true,
        lowercase: true
    },
    profileURL: String,
    role: {
        type: String,
        enum: {
            values: ['creator', 'user'],
            message: 'Role should be Creator/User!!'
        },
        default: 'user'
    },
    password: {
        type: String,
        required: [true, "Password is Mandatory"],
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, "Confirm Password is Mandatory"],
        validate: {
            //This only works on Create and Save!!!
            validator: function (el) {
                return el === this.password;
            },
            message: "Passwords are not the same"
        }
    }
});

userSchema.pre('save', async function (next) {
    //This fn will run if pw is modified
    if (!this.isModified('password')) return next();

    //Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    //Delete the confirm Pw field
    this.confirmPassword = undefined;
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;