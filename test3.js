require("dotenv").config();
const { storage } = require("./cloudConfig");
const fs = require("fs");
const req = { file: {} };
const file = {
  originalname: "real.jpg",
  mimetype: "image/jpeg",
  stream: fs.createReadStream("real.jpg") 
};
storage._handleFile(req, file, function(err, info) {
  if (err) console.error("Error:", err);
  else console.log("Success:", JSON.stringify(info, null, 2));
});
