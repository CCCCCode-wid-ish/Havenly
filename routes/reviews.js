const express = require("express");

const wrapAsync = require("../utils/wrapAsync")
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn } = require("../middleware.js"); // ✅ add this
const router = express.Router({mergeParams : true})



//For review
const validateReview = (req, res, next) => {
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



//Delete Review route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}})
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review is Deleted");
    res.redirect(`/listings/${id}`);


}))

//Reviews
//Post Route

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    req.flash("success", "New Review is Created");

    res.redirect(`/listings/${listing._id}`);
  }),
);

module.exports = router;