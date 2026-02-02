const { number } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(), //if any date is not set by
    //defalt the date added
  },
});

module.exports = mongoose.model("Review", reviewSchema);
