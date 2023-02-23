const crypto = require("crypto");
const cryptopsw =(password)=>{
    return crypto.createHmac("sha256", password).digest("hex");
}

const otpgenerate =()=>{
    return Math.floor(1000 + Math.random() * 9000);
}


module.exports={cryptopsw , otpgenerate}