const nodemailer = require("nodemailer");

const sendemail =(...data)=>{
  console.log(data[0],data[1])
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: "mishru2594@gmail.com", pass: process.env.Mypassword },
  });

  var mailOptions = {
    from: 'mishru2594@gmail.com',
    to: data[0],
    subject: 'Verify your email with otp',
    html: `<h1>To verify your mail this is the otp :${data[1]}</h1></br>
    <h1>This Otp is valid for 1 Hour</h1>`
};

transporter.sendMail(mailOptions, function(error, info) {
  if (error) {
      console.log(1)
  } else {
      console.log(0)
  }
});
}


module.exports = sendemail;
