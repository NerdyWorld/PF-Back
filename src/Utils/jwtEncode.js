require("dotenv").config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;


import jwt from "jsonwebtoken";

export const generateToken = (id) =>{
  return jwt.sign({id}, JWT_SECRET_KEY);
};


// {expiresIn: "1d"}
