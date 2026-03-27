// const Listing = require("../models/listing")

// //index function is an async function , it will render all the listings
// module.exports.index = async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index" ,{allListings});
// }

// module.exports.renderNewForm = (req, res) => {
//   console.log(req.user);
//   res.render("listings/new");
// };

// module.exports.showListing = (async (req, res) => {
//     let { id } = req.params;

//     const listing = await Listing.findById(id)   // ✅ replace your old populate with this
//         .populate({
//             path: "reviews",
//             populate: {
//                 path: "author"
//             }
//         })
//         .populate("owner");

//     if (!listing) {
//         req.flash("error", "listing requested by you does not exist");
//         return res.redirect("/listings");
//     }

//     console.log(listing);
//     res.render("listings/show", { listing });
// })

// module.exports.createListing = (async (req, res, next) => {
//   const newListing = new Listing(req.body.listing);
//   //✅ To validate incoming request data

//   //This check ensures that the client is actually
//   // sending listing data before you try to save it
//   //  in MongoDB.
//   // let result = listingSchema.validate(req.body);
//   // //we have create the listingSchema in joi in which v have defined the constraints the
//   // //req body is satisfying all the conditions are not
//   // console.log(result);
//   // if (result.error) {
//   //   throw new ExpressError(errMsg, 400);
//   // }
//   newListing.owner = req.user._id; //  ADDED THIS LINE ,CURRENT USER VALUE IS STORED
//   console.log(req.user);
//   await newListing.save();
//   req.flash("success", "New Listing created");
//   res.redirect("/listings");
// })

// module.exports.renderEditForm = (async (req, res) => {
//     let { id } = req.params; //extracting id
//     const listing = await Listing.findById(id);
//     if (!listing) {
//       req.flash("error", "listing requested by you doesnot existing ");

//       return res.redirect("/listings"); //  return prevents double response
//     }
//     res.render("listings/edit", { listing });
// })

// module.exports.updateListing = (async (req, res) => {
//     const { id } = req.params;

//     const listing = await Listing.findById(id);

//     // If image URL is empty, keep old image
//     if (!req.body.listing.image?.url?.trim()) {
//         req.body.listing.image = listing.image;
//     }

//     await Listing.findByIdAndUpdate(id, req.body.listing, {
//         runValidators: true,
//     })
//      req.flash("success", "Listing updated successfully!");
//     res.redirect(`/listings/${id}`);
// }
// )

// module.exports.destroyListings = async (req, res) => {
//   const { id } = req.params;

//   const deletedListing = await Listing.findByIdAndDelete(id);
//   console.log(deletedListing);

//   req.flash("success", "Listing Deleted!");
//   return res.redirect("/listings"); //return added
// };

const Listing = require("../models/listing");

// INDEX
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

// NEW FORM
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

// SHOW
module.exports.showListing = async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
};

// CREATE
module.exports.createListing = async (req, res) => {

  console.log("FILE DATA:", req.file);
  const newListing = new Listing(req.body.listing);

  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  newListing.owner = req.user._id;

  await newListing.save();

  req.flash("success", "New Listing created!");

  res.redirect("/listings");
};


// EDIT FORM
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/edit", { listing });
};

// UPDATE
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save();
  }

  req.flash("success", "Listing updated successfully!");

  res.redirect(`/listings/${id}`);
};

// DELETE
module.exports.destroyListings = async (req, res) => {
  const { id } = req.params;

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing Deleted!");

  res.redirect("/listings");
};

