const mongoose = require("mongoose");
const initData = require('./data.js');
const Listing = require("../models/listing.js");

main()
    .then(() => {
        console.log("connected to the db")
    }).catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust_dev");
   


  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "65a3f1bc9d2e4f0a1b2c3d4e",
    }));
  
    await Listing.insertMany(initData.data);
    console.log("data was initialized")
   }

initDB();