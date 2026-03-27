const express = require("express");
require("dotenv").config();
const multer = require("multer");
const { storage } = require("./cloudConfig");
const app = express();
const upload = multer({ storage });
app.post("/test", upload.single("listing[image]"), (req, res) => {
  res.json({ file: req.file });
});
const server = app.listen(3002, async () => {
  console.log("running");
  const FormData = require("form-data");
  const fs = require("fs");
  const form = new FormData();
  form.append("listing[image]", fs.createReadStream("package.json"));
  fetch("http://localhost:3002/test", { method: "POST", body: form })
    .then(r => r.json())
    .then(data => { console.log(JSON.stringify(data, null, 2)); server.close(); })
    .catch(err => { console.error(err); server.close(); });
});
