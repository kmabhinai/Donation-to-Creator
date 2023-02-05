const express = require("express");
const authController = require("./../controllers/authController");
const donationController = require("./../controllers/donationController");

const router = express.Router();

router.use(authController.protect);

router
    .route("/create")
    .post(donationController.createDonation);

router.use(authController.restrictTo('admin'));

module.exports = router;