const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8080;

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');

const ExpressError = require("./utils/ExpressError")


const session = require("express-session")

const listings = require("./routes/listing")
const reviews = require("./routes/reviews")
const flash = require("connect-flash");


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
    httpOnly: true, //for cross setting
    secure: false, // true only if HTTPS
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000,
      
    },
  }, // true only if using HTTPS
};

app.get("/", (req, res) => {
  res.send("hi i am root");
});
// session FIRST
app.use(session(sessionOptions));

// then flash
app.use(flash());

// then locals (BEFORE routes)
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// THEN routes
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);



app.use((req, res, next) => {
next(new ExpressError("Page Not Found", 404));

});


//Middleware
app.use((err, req, res, next) => {
    let { statusCode=500, message="Something went wrong " } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error",{message});
    
})


app.listen(port, () => {
    console.log("Server is listening to the port");
  
})

