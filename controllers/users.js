const passport = require("passport");
const User = require("../models/user");




// render signup form

module.exports.renderSignUpForm = (req, res) => {
  res.render("users/signup");
};


// signup user

module.exports.userSignUp = async (req, res) => {
  try {
    //Extracting the password and body from the user
    let { username, email, password } = req.body;
    //Create the new user
    const newUser = new User({ email, username });
    //Registering the new user
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);

    //For automatically loggedIn after sign up
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to havenly");
      res.redirect(req.session.redirectUrl); //using from middleware
    });
  } catch {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

// login logic
module.exports.userLogin = (req, res, next) => {
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, function () {

    req.flash("success", "Welcome back to WanderLust!");

    const redirectUrl = req.session.redirectUrl || "/listings";
    res.redirect(redirectUrl);

  });
};

// logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};