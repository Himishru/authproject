const Joi = require('joi');

const  validator =  Joi.object({
     fullname : Joi.string().min(3).required(),
     email:Joi.string().email().lowercase().required(),
     password: Joi.string().min(5).max(10).required(),
     confirm_password:Joi.string().equal(Joi.ref('password')).messages({'any.only': 'password does not match' }).required(),
     address:Joi.string().min(5).required()
   })

   const  loginvalidation =  Joi.object({
    email:Joi.string().email().lowercase().required(),
    password: Joi.string().min(5).max(10).required()
  })

  const  confirmvalidation =  Joi.object({
    password: Joi.string().min(5).max(10).required(),
    confirm_password:Joi.string().equal(Joi.ref('password')).messages({'any.only': 'password does not match' }).required(),
  })
  
 module.exports = {validator,loginvalidation,confirmvalidation};