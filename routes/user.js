const express = require("express");
const router = express.Router();
//Before calling the new user require the models 
const User = require("../models/user")
const wrapAsync = require("../utils/wrapAsync");
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
        const registerdUser = await User.register((newUser, password));
        console.log(registerdUser);
        res.flash('success', "Welcome to havenly")
        res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
        
    }
    
})



router.get("/login", (req, res) => {
    res.render("users/login");
})

module.exports = router;