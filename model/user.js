const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true,
      },
      address:{
        type:String,
        required:true
      },
      isVerify:{
        type:Boolean,
        default:false
      }
})
userSchema.set("timestamps",true)
module.exports = mongoose.model("User", userSchema);