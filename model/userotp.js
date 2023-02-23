const mongoose = require("mongoose")
const otpSchema = new mongoose.Schema({
    otp: { type: Number, required: true },
    email: {
        type: String,
        required: true
      },
    createdAt:{
        type:Date
    }  
})
// otpSchema.index({ createdAt: 1 })
module.exports = mongoose.model("Otp", otpSchema)