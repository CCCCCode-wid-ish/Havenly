const express = require("express");

const wrapAsync = require("../utils/wrapAsync")
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing.js");
const {validateReview} = require("../middleware.js")
const { isLoggedIn , isReviewAuthor } = require("../middleware.js"); // ✅ add this
const router = express.Router({mergeParams : true})
const Review = require("../models/review.js");





//Delete Review route
router.delete(
  "/:reviewId",
  isReviewAuthor,
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review is Deleted");
    res.redirect(`/listings/${id}`);
  }),
);

//Reviews
//Post Route

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    req.flash("success", "New Review is Created");

    res.redirect(`/listings/${listing._id}`);
  }),
);

module.exports = router;