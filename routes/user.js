const express = require("express");
const router = express.Router();
//Before calling the new user require the models 
const User = require("../models/user")
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
router.get("/signup", (req, res) => {
    res.render("users/signup");
})

//Sign up from user
router.post("/signup", async (req, res) => {
    try {
        //Extracting the password and body from the user
        let { username, email, password } = req.body;
        //Create the new user 
        const newUser = new User({ email, username })
        //Registering the new user
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);


        //For automatically loggedIn after sign up
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
              req.flash("success", "Welcome to havenly");
              res.redirect("/listings");

        })
     
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
        
    }
    
})



router.get("/login", (req, res) => {
    res.render("users/login");
})

// ✅ Correct - add successRedirect inside passport.authenticate
router.post("/login", passport.authenticate("local", { 
    failureRedirect: '/login', 
    failureFlash: true,
    successRedirect: '/listings',  // ✅ handle redirect here
    successFlash: "Welcome to WanderLust! You are logged in!" // ✅ flash here
}));
//Used for authentication


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