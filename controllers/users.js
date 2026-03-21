const {username , email , password } = require("../models/")

module.exports.renderSignUpForm = (req, res) => {
  res.render("users/signup");
};


module.exports.userSignin = (async (req, res) => {
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
            res.redirect(req.session.redirectUrl); //using from middleware

        })
    } catch {

    }
}
)