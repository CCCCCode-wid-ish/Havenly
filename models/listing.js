const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")


const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1768969874178-4aea098d11fc?q=80&w=1165&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  },
  //which means it usually
  // means the <img> tag exists, but the browser has NO valid image data to show.
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref : "Review"
    }
  ]
});

//we have two logic for images
/*
first default logic checks for the image which is undefined and not existing
2nd logic checks image is der but the link is empty 
for the user (Client)
*/

listingSchema.post("findOneAndDelete", async (listing) => {

  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } })
  }
})






const Listing = mongoose.model("Listing" , listingSchema)
//mongoose.model(modelName, schema)
//Model name First letter is usually Capital,Singular form
//mongoose.model("Listing", schema) creates a model that allows us to perform CRUD operations
//  on the listings collection in MongoDB.
module.exports = Listing;
