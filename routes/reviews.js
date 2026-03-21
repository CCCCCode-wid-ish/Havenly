const express = require("express");

const wrapAsync = require("../utils/wrapAsync")
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing.js");
const {validateReview} = require("../middleware.js")
const { isLoggedIn , isReviewAuthor } = require("../middleware.js"); // ✅ add this
const router = express.Router({mergeParams : true})
const Review = require("../models/review.js");
const reviewController = require("../controllers/reviews.js")




//Delete Review route
router.delete(
  "/:reviewId",
  isReviewAuthor,
  isLoggedIn,
  wrapAsync(reviewController.destroyReview),
);

//Reviews
//Post Route

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

module.exports = router;