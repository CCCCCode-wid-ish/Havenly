const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync")
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");
const { isOwner , validateListing}    = require("../middleware.js")


const ListingController = require("../controllers/listings.js")


//GET : parsing the data ,Index Route 
router.get('', wrapAsync(ListingController.index));


//NEW route  
router.get("/new", isLoggedIn ,ListingController.renderNewForm);


//Show route : read
// Show route
router.get('/:id', wrapAsync(ListingController.showListings));

//Create Route 
router.post("", validateListing,
    wrapAsync(ListingController.createListing)
     
     )
    




    //let {title , description , price, location country} = req.body
    
//Edit route

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(ListingController.renderEditForm)
);

//Update Route
router.put(
  "/:id",
  
  isLoggedIn,
  isOwner,
  validateListing, // the listing which we are trying to create is valid or not 

  wrapAsync(ListingController.updateListing),
);

// Delete Route or destroy listing 
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(ListingController.destroyListings));



module.exports = router;