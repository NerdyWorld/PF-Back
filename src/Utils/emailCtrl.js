require("dotenv").config();

const { MAIL_ID } = process.env;
const { MAIL_PASSWORD } = process.env;


const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendMail = asyncHandler(async(data, req, res) =>{
try{
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: MAIL_ID, 
      pass: MAIL_PASSWORD, 
    },
  });


  let info = await transporter.sendMail({
    to: data.to, 
    subject: data.subject,
    html: data.html,
    attachments: [
      {
        filename: "passwordImage.png",
        path: "./images/passwordImage.png",
        cid: "password"
      },
      {
        filename: "github.png",
        path: "./images/github.png",
        cid: "github"
      },
      {
        filename: "instagram.png",
        path: "./images/instagram.png",
        cid: "instagram"
      },
      {
        filename: "twitter.png",
        path: "./images/twitter.png",
        cid: "twitter"
      },
    ] 
  });

}catch(err){
  throw new Error(err.message);
}

});


module.exports = sendMail



