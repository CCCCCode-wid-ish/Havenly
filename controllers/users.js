// const passport = require("passport");
// const User = require("../models/user");

// // render signup form

// module.exports.renderSignUpForm = (req, res) => {
//   res.render("users/signup");
// };

// // signup user

// module.exports.userSignUp = async (req, res, next) => {
//   try {
//     //Extracting the password and body from the user
//     let { username, email, password } = req.body;
//     //Create the new user
//     const newUser = new User({ email, username });
//     //Registering the new user
//     const registeredUser = await User.register(newUser, password);
//     console.log(registeredUser);

//     //For automatically loggedIn after sign up
//     req.login(registeredUser, (err) => {
//       if (err) {
//         return next(err);
//       }
//       req.flash("success", "Welcome to havenly");
//       res.redirect(req.session.redirectUrl); //using from middleware
//     });
//   } catch(e) {
//     req.flash("error", e.message);
//     res.redirect("/signup");
//   }
// };

// module.exports.renderLoginForm = (req, res) => {
//   res.render("users/login");
// };

// // login logic
// module.exports.login = (req, res, next) => {
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true
//   })(req, res, function () {

//     req.flash("success", "Welcome back to WanderLust!");

//     const redirectUrl = req.session.redirectUrl || "/listings";
//     res.redirect(redirectUrl);

//   });
// };

// // logout
// module.exports.logout = (req, res, next) => {
//   req.logout((err) => {
//     if (err) return next(err);

//     req.flash("success", "You are logged out!");
//     res.redirect("/listings");
//   });
// };

const User = require("../models/user");

// render signup form
module.exports.renderSignUpForm = (req, res) => {
  res.render("users/signup");
};

// signup user
module.exports.userSignUp = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    // Passport's req.login to log them in immediately after signup
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to WanderLust!");
      res.redirect("/listings"); // Best to redirect to home/listings after a fresh signup
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

// login logic
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to WanderLust!");

  // Check res.locals first, then fallback to /listings
  let redirectUrl = res.locals.redirectUrl || "/listings";

  // Safety check: if redirectUrl contains "login", don't redirect there!
  if (redirectUrl.includes("/login")) {
    redirectUrl = "/listings";
  }

  res.redirect(redirectUrl);
};
// logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};