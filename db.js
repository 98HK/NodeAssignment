require("dotenv").config();
const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URL;

const connectToMongo = () => {
    try {
      mongoose.connect(mongoURI, () => {
        console.error("Mongo Connected");
      });
    } catch (e) {
      console.log(e);
    }
  };
  
  module.exports = connectToMongo;
  