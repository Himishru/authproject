const User = require("../model/user");
const validatedata = require("../middleware/validation");
const crypto = require("crypto");
const sendmail = require("../service/sendemail");
const jwt = require("jsonwebtoken");
const Otp = require("../model/userotp");
const otpandcrypto = require("../service/cripto");

const userauth = async (req, res) => {
  try {
    const validation = validatedata.validator.validate(req.body);
    const { value, error } = validation;

    if (error) {
      const message = error.details.map((x) => x.message);

      res.status(400).json({
        status: "error",
        message: "Invalid request data",
        data: message,
      });
    } else {
      const { email, password } = req.body;
      const userData = new User(req.body);
      const userExits = await User.findOne({ email: email });

      if (userExits) {
        res
          .status(400)
          .json({ status: "failed", message: "Email Already Exist" });
      } else {
        userData.password = otpandcrypto.cryptopsw(password);
        const data = await userData.save();

        if (data) {
          // token authentication
          const token = jwt.sign(
            { user_id: userData._id },
            process.env.Secretkey,
            {
              expiresIn: "1h",
            }
          );

          const otpData = new Otp();
          otpData.email = email;
          otpData.otp = otpandcrypto.otpgenerate();
          const generateotp = await otpData.save();
          let info = sendmail(otpData.email, otpData.otp);
          res.status(201).json({
            status: "Successful",
            message: "Data save Successfully",
            data: data,
            info: info,
            token: token,
            generateotp: generateotp,
          });
        } else {
          res.status(404).json({
            status: "Failed",
            message: "User has not registered !",
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const verify = async (req, res) => {
  const { otp, email } = req.body;
  const userExits = await User.findOne({ email: email });
  if (!userExits) {
    res.status(400).json({ status: "failed", message: "User does not exist" });
  } else {
    const otpExist = await Otp.findOne({ email: email, otp: otp });
    console.log(otpExist);
    if (otpExist) {
      await Otp.deleteMany({ email });
      let updateRec = await User.findOneAndUpdate(
        { email },
        {
          $set: {
            isVerify: true,
          },
        },
        { new: true }
      );
      return res.status(200).json({
        status: true,
        message: "success",
        data: updateRec,
      });
    } else {
      res.status(201).json({
        status: "Failed",
        message: "User not verifyed",
      });
    }
  }
};

const resend = async (req, res) => {
  const userData = await User.findOne({ email: req.body.email });
  const otpData = await Otp.findOne({ email: req.body.email });
  const otp = new Otp();
  if (otpData) {
    Otp.deleteMany({ email: req.body.email }).then(async (result) => {
      if (result) {
        otp.email = userData.email;
        otp.otp = otpandcrypto.otpgenerate();
        const generateotp = await otp.save();
        sendmail(otp.email, otp.otp);
        res.status(201).json({
          status: "Successful",
          message: "Data save Successfully",
          generateotp,
        });
      }
    });
  } else {
    res.json({
      status: "Failed",
      message: "User not Exist",
    });
  }
};

const login = async (req, res) => {
  try {
    const validation = validatedata.loginvalidation.validate(req.body);
    const { value, error } = validation;
    if (error) {
      const message = error.details.map((x) => x.message);

      res.status(400).json({
        status: "error",
        message: "Invalid request data",
        data: message,
      });
    } else {

      const { email, password } = req.body;
      const userExits = await User.findOne({ email: email });

      if (!userExits) {
        res
          .status(400)
          .json({ status: "failed", message: "Email does not Exist" });
      } else {
        if(userExits.isVerify === true){
          const crytopsw = otpandcrypto.cryptopsw(password);
          if (crytopsw === userExits.password) {
            const token = jwt.sign(
              { user_id: userExits._id, email: email },
              process.env.Secretkey,
              {
                expiresIn: "1h",
              }
            );
            console.log(token);
            //res.status(200).json(token);
            res
              .status(200)
              .json({ message: "user is logged success fully", token });
          } else {
            res.status(404).send("invalid credencials");
          } 
        }else{
          res
              .status(404)
              .json({ message: "Please verify your email by Otp"});
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const userExits = await User.findOne({ email: email });
    if (!userExits) {
      res
        .status(400)
        .json({ status: "failed", message: "Email does not Exist" });
    } else {
      const otp = new Otp();
      otp.email = userExits.email;
      otp.otp = otpandcrypto.otpgenerate();
      const generateotp = await otp.save();
      sendmail(otp.email, otp.otp);
      res.status(201).json({
        status: "Successful",
        message: "Otp sent to your email ,Please check it !!",
        generateotp,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const changespassword = async (req, res) => {
  const { email, otp, password, confirm_password } = req.body;
  try {
    const userExits = await User.findOne({ email: email });
    if (!userExits) {
      res
        .status(400)
        .json({ status: "failed", message: "Email does not Exist" });
    } else {
      const otpExist = await Otp.findOne({ email: email, otp: otp });
      if (otpExist) {
        if (password === confirm_password) {
            await Otp.deleteMany({ email:email });
          let updateRec = await User.findOneAndUpdate(
            { email },
            {
              $set: {
                password: otpandcrypto.cryptopsw(password),
              },
            },
            { new: true }
          );
          return res.status(200).json({
            status: true,
            message: "Your password changed successfully !!",
            data: updateRec,
          });
        } else {
          return res.status(200).json({
            status: false,
            message: "password and confirm password does not match",
          });
        }
      } else {
        return res.status(404).json({
          status: false,
          message: "otp is not verifyied ",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const gettherecordbytoken = async (req, res) => {
  var token = req.headers["authorization"];
  if (!token) {
    return res.sendStatus(403);
  } else {
    const bearerToken = token.split(" ")[1];
    let decodedata = await jwt.decode(bearerToken, process.env.Secretkey);
    console.log(decodedata);
    const getdatafromuser = await User.findOne({ id: decodedata.user_id });
    if (getdatafromuser) {
      return res.status(200).json({
        status: true,
        message: "Record of"+" "+getdatafromuser.fullname,
        getdatafromuser: getdatafromuser,
      });
    }
  }
};

module.exports = {
  userauth,
  verify,
  resend,
  login,
  forgetPassword,
  changespassword,
  gettherecordbytoken
};
