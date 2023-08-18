const e = require("express");
const userController = require("../../Controllers/User/userController");
const Users = require("../../Models/UserModel/UserModel");

const userHandler = () => {};


userHandler.createUserHandler = async(req, res) =>{

  const response = await userController.createUser(req.body);

  if(response.msg === "Email Error" || response.msg === "Username Error"){
    res.status(500).json(response);
  }else{
    res.status(200).json(response);
  }
};

userHandler.loginUserHandler = async(req, res) =>{
  
  const response = await userController.loginUser(req.body);

  if(response.msg === "Wrong Email" || response.msg === "Wrong Username"){
    res.status(500).json(response);
  }else{
    res.status(200).json(response);
  }
};

userHandler.updateUserHandler = async(req, res) =>{

  const response = await userController.updateUser(req.body, req.params.userId);

  if(response.msg === "User not found"){
    res.status(500).json(response);
  }else{
    res.status(200).json(response);
  }
};

userHandler.deleteUserHandler = async(req, res) =>{
  const response = await userController.deleteUser(req.params.userId);

  res.status(200).json(response);
};

userHandler.disableUserHandler = async(req, res) =>{
// El disable actua como un toggle, si la propiedad DISABLED del user,
// esta en TRUE, la pone en FALSE, y viceversa.

  const response = await userController.disableUser(req.params.userId);

  if(response.msg === "User not found"){
    res.status(500).json(response);
  }else{
    res.status(200).json(response);
  }

};

userHandler.getAllUsersHandler = async(req, res) =>{

  const response = await userController.getAllUsers();

  res.status(200).json(response);
};




userHandler.forgotPasswordHandler = async(req, res) =>{

  const response = await userController.forgotPassword(req.body.email);

  console.log(response);
};





module.exports = userHandler;