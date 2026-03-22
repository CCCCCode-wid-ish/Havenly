// const express = require("express");
// const router = express.Router();
// const wrapAsync = require("../utils/wrapAsync")
// const Listing = require("../models/listing.js");
// const { isLoggedIn } = require("../middleware.js");
// const { isOwner , validateListing}    = require("../middleware.js")

// const ListingController = require("../controllers/listings.js")

// router
//   .route("/")
//  // Index Route
//   .get(wrapAsync(ListingController.index))
//   //Create Route
//   .post(
//     isLoggedIn,
//     validateListing,
//     wrapAsync(ListingController.createListing),
// );

// router
//   .route("/:id")
//   //Destroy
//   .delete(isLoggedIn, isOwner, wrapAsync(ListingController.destroyListings))
//  //Update Route
//   .put(
//   isLoggedIn,
//   isOwner,
//   validateListing, // the listing which we are trying to create is valid or not

//   wrapAsync(ListingController.updateListing),
// );

// // //GET : parsing the data ,Index Route
// // router.get('', wrapAsync(ListingController.index));

// //NEW route
// router.get("/new", isLoggedIn ,ListingController.renderNewForm);

// //Show route : read
// // Show route
// //router.get('/:id', wrapAsync(ListingController.showListings));

// //Create Route
// //router.post("", validateListing,
// //     wrapAsync(ListingController.createListing)

// //      )

//     //let {title , description , price, location country} = req.body

// //Edit route

// router.get(
//   "/:id/edit",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(ListingController.renderEditForm)
// );

// //Update Route
// // router.put(
// //   "/:id",

// //   isLoggedIn,
// //   isOwner,
// //   validateListing, // the listing which we are trying to create is valid or not

// //   wrapAsync(ListingController.updateListing),
// // );

// // Delete Route or destroy listing
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(ListingController.destroyListings));

// module.exports = router;

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const ListingController = require("../controllers/listings.js");

// --- 1. Index and Create ---
router
  .route("/")
  .get(wrapAsync(ListingController.index))
  .post(
    isLoggedIn,
    validateListing,
    wrapAsync(ListingController.createListing),
  );

// --- 2. NEW ROUTE (Must come BEFORE /:id) ---
// If this is below /:id, Express will think "new" is an "id"
router.get("/new", isLoggedIn, ListingController.renderNewForm);

// --- 3. ID-Specific Routes (Show, Update, Delete) ---
router
  .route("/:id")
  .get(wrapAsync(ListingController.showListing)) // Added Show Route here
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(ListingController.updateListing),
  )
  .delete(isLoggedIn, isOwner, wrapAsync(ListingController.destroyListings));

// --- 4. Edit Route ---
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(ListingController.renderEditForm),
);

module.exports = router;