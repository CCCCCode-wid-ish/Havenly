const express = require("express");
const router = express.Router();
//Before calling the new user require the models 
const User = require("../models/user")
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");


const userController = require("../controllers/users")

//rendering the signup form 
router.get("/signup", userController.renderSignUpForm);

//Sign up from user
router.post("/signup", wrapAsync(userController.userSignUp));

 
//login form 
router.get("/login", userController.renderLoginForm);

// ✅ Correct - add successRedirect inside passport.authenticate
router.get("/signup", userController.renderSignUpForm);
//     successRedirect: '/listings',  // ✅ handle redirect here
//     successFlash: "Welcome to WanderLust! You are logged in!" // ✅ flash here
// }));
 //Used for authentication

//logout 
router.get("/logout", userController.logout);

module.exports = router;