const Listing = require("../models/listing")




//index function is an async function , it will render all the listings 
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index" ,{allListings});
} 
    
