const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8080;

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');

const ExpressError = require("./utils/ExpressError")


const session = require("express-session")

const listingRouter = require("./routes/listing")
const reviewRouter = require("./routes/reviews")
const flash = require("connect-flash");
//Passport

const passport = require("passport");
const LocalStratergy = require("passport-local")
const User = require("./models/user.js")

const UserRouter = require("./routes/user.js")

const { listingSchema, reviewSchema } = require("./schema.js");





main()
    .then(() => {
        console.log("connected to the db")
    }).catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust_dev");
   


  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.engine("ejs", ejsMate);


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = {
  secret: "mySecretKey",
  resave: false,
  saveUninitialized: true,

  cookie: {
  httpOnly: true,
  secure: false,
  expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
  maxAge: 7 * 24 * 60 * 60 * 1000,
},

};

app.get("/", (req, res) => {
  res.send("hi i am root");
});
// session FIRST
app.use(session(sessionOptions));

// then flash
app.use(flash());

//Implementing the passport


//We need the session to implement the passport
//to implement Local  Stratergy
//User in one session login credentials shld be comman
//If they are using the different tabs of the same website than the credential shld be same 
//so their is one  session  : we known the sesion is of the individual user 
 //So passport uses the session 

app.use(passport.initialize())
//A middleware that initializes passport 

app.use(passport.session())
//A web application needs a aability to identify
//user as they browse frm page to page
//this series of requests and responses , each associated with the same user is known as session 

passport.use(new LocalStratergy(User.authenticate()));
//inside the passport we created the local stratergy
//Our user , the req ,they have to be authenticated from the localStratergy
//And to authenticate that user we use the method authenticate
//Authentication means making the user to  sigining up , login the user
//It is the static method added by default by passport - mongoose

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// serializeUser() Generates a function that is used by Passport to serialize users into the session : storing the info
// deserializeUser() Generates a function that is used by Passport to deserialize users into the session : unstore





// then locals (BEFORE routes)
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  
  res.locals.error = req.flash("error");
  //Cannot require the req.user directly in navbar file
  //so requiring here
  res.locals.currUser = req.user;
  
  
  next();
});


// //DemoUser
// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username : "delta-student"
//   })
//   let registerdUser = await User.register(fakeUser, "helloworld") // static method
//   res.send(registerdUser);
  
// })
// THEN routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", UserRouter);

//404 HANDLER
app.use((req, res, next) => {
next(new ExpressError("Page Not Found", 404));

});


//Middleware
app.use((err, req, res, next) => {
    let { statusCode=500, message="Something went wrong " } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error",{message});
    
})
 // GLOBAL ERROR HANDLER (FIXED)
// ======================
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;

  // 🔥 PREVENTS HEADERS ERROR
  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).render("error", { message });
});

app.listen(port, () => {
    console.log("Server is listening to the port");
  
})

