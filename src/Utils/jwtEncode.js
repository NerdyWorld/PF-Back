require("dotenv").config();

const {JWT_SECRET_KEY} = process.env;


const jwt = require("jsonwebtoken");

const generateToken = (id) =>{
  return jwt.sign({id}, JWT_SECRET_KEY);
};


module.exports = generateToken;

