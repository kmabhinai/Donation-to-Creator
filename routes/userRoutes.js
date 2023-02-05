const express = require("express");
const authController = require("./../controllers/authController");

const router = express.Router();

router
    .route("/signup")
    .post(authController.signup);

router
    .route("/login")
    .post(authController.login);

//Protect all users after this
router.use(authController.protect);



router.use(authController.restrictTo('admin'));

module.exports = router;