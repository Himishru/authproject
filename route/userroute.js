const express = require('express');
const router = express.Router();

//middleware

//controller
const userauth = require('../controller/usercontroller')

//route
router.post('/user',userauth.userauth)
router.get('/user/verify',userauth.verify)
router.post('/user/resendotp',userauth.resend)
router.post('/user/login',userauth.login)
router.post('/user/resetpassword',userauth.forgetPassword)
router.post('/user/changespassword',userauth.changespassword)
router.get('/user/me',userauth.gettherecordbytoken)


module.exports =router;