// const express = require("express");
// const router = express.Router();
// //Before calling the new user require the models
// const User = require("../models/user")
// const wrapAsync = require("../utils/wrapAsync");
// const passport = require("passport");
// const { saveRedirectUrl } = require("../middleware");

// const userController = require("../controllers/users")

// router
//   .route("/signup")
//   //rendering the signup form
//   .get( userController.renderSignUpForm)
//   //Sign up from user
//   .post( wrapAsync(userController.userSignUp));

// // //rendering the signup form
// // router.get("/signup", userController.renderSignUpForm);

// // //Sign up from user
// // router.post("/signup", wrapAsync(userController.userSignUp));

// //login form
// // router.get("/login", userController.renderLoginForm);

// // Correct - add successRedirect inside passport.authenticate
// // router.get("/signup", userController.renderSignUpForm);
// //     successRedirect: '/listings',  // ✅ handle redirect here
// //     successFlash: "Welcome to WanderLust! You are logged in!" // ✅ flash here
// // }));
// //Used for authentication

// //

// router.route("/login")
//     .get( userController.renderLoginForm)
//     .post(
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.login,
// );

// //logout
// router.get("/logout", userController.logout);

// module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users");

// --- Signup Routes ---
router
  .route("/signup")
  .get(userController.renderSignUpForm)
  .post(wrapAsync(userController.userSignUp));

// --- Login Routes ---
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl, // 1. Save the intended destination before passport resets the session
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login, // 2. Finalize login (flash message & actual redirect)
  );

// --- Logout Route ---
router.get("/logout", userController.logout);

module.exports = router;