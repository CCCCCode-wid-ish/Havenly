const express = require("express");
const router = express.Router();
//Before calling the new user require the models 
const User = require("../models/user")
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");


const userController = require("../controllers/users")


router.get("/signup", userController.renderSignUpForm);

//Sign up from user
router.post("/signup",wrapAsync(userController.signup) )

 

router.get("/login", (req, res) => {
    res.render("users/login");
})

// ✅ Correct - add successRedirect inside passport.authenticate
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
      req.flash("success", "Welcome to WanderLust! You are logged in!");
      let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl); // ✅ fallback route
  },
);
//     successRedirect: '/listings',  // ✅ handle redirect here
//     successFlash: "Welcome to WanderLust! You are logged in!" // ✅ flash here
// }));
//Used for authentication


//logout 

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
           return next(err);
        }
        req.flash("success", "you are logged out");
        res.redirect("/listings");
    })
})
module.exports = router;