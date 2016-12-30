import mongoose from "mongoose";

// mongoose.set("debug", true);

import config from "./../../../config";

const connectionString = "mongodb://" + config.mongo.host + ":" + config.mongo.port + "/" + config.mongo.db;

mongoose.connect(connectionString);

let db = mongoose.connection;

db.on("error", function (err) {
  console.log("connection error: " + err);
  process.exit(1);
});

db.once("open", function () {
  // console.log("open db");
});

export default mongoose;