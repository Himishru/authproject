const mongoose = require("mongoose")
const dotenv = require("dotenv").config();

mongoose.set('strictQuery', true);
mongoose.connect( process.env.Url,{useNewUrlParser: true})
const connection = mongoose.connection.once("open",
function(){ console.log("Database is connected successfully");})