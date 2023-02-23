const express = require('express');
const createHttpError = require('http-errors')
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser")
const db =require("./model/config")
const userRouter = require('./route/userroute')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(userRouter)

app.listen(process.env.Port,()=>{
    console.log("server is started")
})