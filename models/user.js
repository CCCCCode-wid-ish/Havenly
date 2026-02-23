const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email: {
        type: String,
        required : true 
    }
    //Your are free to define your User how u like .Passport-Local_mongoose will add a  username
    //hash and salt field to store the usernaem , the hashed password and the salt value
})


userSchema.plugin(passportLocalMongoose);
//Automatically implement hash and salt field , username
module.exports = mongoose.model("User", userSchema);