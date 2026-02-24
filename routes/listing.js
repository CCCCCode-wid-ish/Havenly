const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync")
const { listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");


const validateListing = (req, res, next) => {
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
  

//GET : parsing the data ,Index Route 
router.get('', async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index" ,{allListings});
})


//NEW route  
router.get("/new", isLoggedIn, (req, res) => {
  console.log(req.user)
  res.render("listings/new")

})


//Show route : read
// Show route
router.get('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    
    const listing = await Listing.findById(id)   // ✅ replace your old populate with this
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "listing requested by you does not exist");
        return res.redirect("/listings");
    }

    console.log(listing);
    res.render("listings/show", { listing });
}));

//Create Route 
router.post("", validateListing,
    wrapAsync(async (req, res, next) => {
      //✅ To validate incoming request data

      //This check ensures that the client is actually
      // sending listing data before you try to save it
      //  in MongoDB.
      let result = listingSchema.validate(req.body);
      //we have create the listingSchema in joi in which v have defined the constraints the
      //req body is satisfying all the conditions are not
      console.log(result);
      if (result.error) {
        throw new ExpressError(errMsg, 400);
      }
      const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id; //  ADDED THIS LINE ,CURRENT USER VALUE IS STORED
      await newListing.save();
      req.flash("success", "New Listing created");
      res.redirect("/listings");
    })
    
)



    //let {title , description , price, location country} = req.body
    
//Edit route

router.get("/:id/edit",isLoggedIn, wrapAsync(async (req, res) => {
    
     let {id} = req.params; //extracting id 
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "listing requested by you doesnot existing ");

    return res.redirect("/listings"); //  return prevents double response
  }
    res.render("listings/edit" , {listing})
})
)

//Update Route
router.put("/:id", validateListing,isLoggedIn,
    wrapAsync(async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  // If image URL is empty, keep old image
  if (!req.body.listing.image?.url?.trim()) {
    req.body.listing.image = listing.image;
    }
    
  await Listing.findByIdAndUpdate(id, req.body.listing, {
    runValidators: true,
  });
      
      req.flash("success", "Listing is updated");

  res.redirect(`/listings/${id}`);
})
);

// Delete Route
router.delete(
  "/:id",isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);

    req.flash("success", "Listing Deleted!");
    return res.redirect("/listings"); //return added
  })
);



module.exports = router;