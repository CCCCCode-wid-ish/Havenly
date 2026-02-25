const Listing = require("./models/listing");

const { listingSchema ,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  //console.log(req.path, "..",req.originalUrl); //path -> trying to access ,originalurl: complete url trying to access
  //Saving redirected url
  
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
      req.flash("error", "you must be logged in to create listings!");
        return res.redirect("/login");
        



  }
  next();
}

/*
when the user logged in in our platform the url which they were 
trying to access the path they have to login the platform is asking for login 
so after successfully loggedin the user comes back to the 
path which ever they were trying to access 
*/


module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}



module.exports.isOwner = async(req, res, next) => {

  const { id } = req.params;
  const listing = await Listing.findById(id);
         if (!listing.owner.equals(req.user._id)) {
           req.flash("error", "You are not the owner of this listing! ");
           return res.redirect(`/listings/${id}`);
  }


  next();


}

module.exports. validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  //LsitingSchema ke uppar validate karenge req ke body
  // from result v r getting the error

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(errMsg, 400);
  } else {
    next();
  }
};

//For review

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  //ListingSchema ke uppar validate karenge req ke body
  // from result v r getting the error

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError( errMsg , 400);
  } else {
    next();
  }
};

  


