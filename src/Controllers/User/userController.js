const Users = require("../../Models/UserModel/UserModel");
const sendMail = require("../../Utils/emailCtrl");
const generateToken = require("../../Utils/jwtEncode");

const userController = () => {};



userController.createUser = async(user) =>{
  try{
    // VALIDATE IF THE EMAIL OR USER IS IN USE
    const validateEmail = await Users.findOne({
      where:{
        email: user.email
      }
    });

    const validateUsername = await Users.findOne({
      where:{
        userName: user.userName
      }
    });

    if(validateEmail){
      return {msg: "Email Error"}
    };
    if(validateUsername){
      return {msg: "Username Error"}
    }

    // CREATE THE USER
    const createUser = await Users.create(user);

    return {msg: "User created", data: createUser.dataValues};

  }catch(error){
    console.log(error);
  }
};

userController.loginUser = async(user) =>{
  try{
    
    const { credential, password } = user;


    const findUserByEmail = await Users.findOne({
      where:{
        email: credential
      }
    });

    const findUserByUsername = await Users.findOne({
      where:{
        userName: credential
      }
    });

    if(!findUserByEmail && !findUserByUsername){
      if(credential.includes("@")){
        return {msg: "Wrong Email"}
      }else{
        return {msg: "Wrong Username"}
      }
    };

    if(findUserByEmail || findUserByUsername){
      const userFound = findUserByEmail ? findUserByEmail : findUserByUsername;

      if(userFound.password === password){
        // Logged succesfully
        return {msg: "User logged", data: userFound}
      }else{
        // Wrong Password
        return {msg: "Wrong Password"};
      }
    }

    
  }catch(error){
    console.log(error);
  }
};

userController.updateUser = async(newUser, userId) =>{
  try{
    
    const findUser = await Users.findOne({
      where:{
        id: userId
      }
    });

    if(!findUser){
      return {msg: "No user found"}
    };

    await findUser.update(newUser);

    await findUser.save();

    return {msg: "User updated", data: findUser};

  }catch(error){
    console.log(error);
  }
};

userController.deleteUser = async(userId) =>{
  try{
    const deleteUser = await Users.destroy({
      where:{
        id: userId
      }
    });

    console.log(deleteUser);
    return {msg: "User deleted"};
  }catch(error){
    console.log(error);
  }
};

userController.disableUser = async(userId) =>{
  try{
    const findUser = await Users.findOne({
      where:{
        id: userId
      }
    });

    if(!findUser){
      return {msg: "User not found"}
    };

    if(findUser){
      if(!findUser.disabled){
        await findUser.update({
          disabled: true
        });

        await findUser.save();

        return {msg: "User disabled", data: findUser}
      }else{
        await findUser.update({
          disabled: false
        });

        await findUser.save();

        return {msg: "User activated", data: findUser}
      }
    };

  }catch(error){
    console.log(error);
  }
  
  // El disable actua como un toggle, si la propiedad DISABLED del user,
  // esta en TRUE, la pone en FALSE, y viceversa.
};


userController.getAllUsers = async() =>{
  try{
    const getAllUsers = await Users.findAll();

    return getAllUsers;

  }catch(error){
    console.log(error);
  }
};


userController.forgotPassword = async(userEmail) =>{
  try{
    const findUser = await Users.findOne({
      where:{
        email: userEmail
      }
    });

    if(!findUser){
      return {msg: "User not found"}
    }

    const getToken = generateToken(findUser.id);

    let HTML = `<!DOCTYPE html>
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Handlee&display=swap" rel="stylesheet">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100;200;300;400&display=swap" rel="stylesheet">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Raleway&display=swap" rel="stylesheet">
      <style>
    
      *{
        margin: 0;
      }
  
      body{
        align-items: center;
        width: 100%;
        overflow: auto;
      }
  
      .body{
        background-color: #f7f3f3;
      }
  
      .title h2{
        text-align: center;
        font-family: 'Raleway', sans-serif !important;
        color: #1f1f1f;
        padding: 2rem;
      }
  
      .container{
        width: 100%;
      }
  
      .message{
          border-radius: 0.5rem;
          background-color: white;
          width: 80%;
          margin-left: 10%;
      }
  
      .messageIn{
        width: 60%;
        margin-left: 20%;
        height: 100%;
        padding: 4rem 0rem;
        text-align: center;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }
  
      .messageImg img{
        width: 30%;
      }
  
      .messageIn h3{
        letter-spacing: 1.3px;
        font-weight: 400;
        font-size: 25px;
        color: #1f1f1f;
        font-family: 'Lexend', sans-serif;
        padding-top: 1rem;
        padding-bottom: 1.7rem;
      }
  
      .messageIn .p1{
        color: rgb(136, 136, 136);
        letter-spacing: 0.5px;
        font-size: 14px;
        font-family: 'Raleway', sans-serif !important;
        padding-bottom: 2rem;
      }
  
  
      .messageIn .a{
        margin-top: 1rem;
        border: none;
        background-color: rgb(189, 58, 102);
        border-radius: 40px;
        font-family: 'Lexend', sans-serif;
        padding: 1.5rem;
        color: whitesmoke;
        width: 40%;
        margin-left: auto;
        margin-right: auto;
        letter-spacing: 1px;
        font-size: 12px;
        box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset !important;
      }
  
      .message .a a{
        text-decoration: none;
        color: whitesmoke;
      }
  
      .bottom{
        align-items: center;
        padding: 4rem;
        padding-top: 4rem;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }
  
      .bottom p{
        font-weight: 400;
        font-size: 13px;
        color: rgb(136, 136, 136);
        line-height: 25px;
        text-align: center;
      }
  
      .bottom .p2{
        font-weight: 500;
        font-size: 12px;
        padding-top: 1rem;
        letter-spacing: 0.5px;
      }
  
      .href1{
        text-decoration: none;
        color: #1f1f1f !important;
        font-size: 12px;
        font-weight: 500;
      }
  
      .href2{
        color: #1f1f1f !important;
        font-size: 12.5px;
        font-weight: 500;
      }
  
      .socials{
        text-align: center;
        margin-top: 4rem;
        gap: 25px;
      }
  
      .socials img{
        width: 20px;
        margin-right: 10px;
      }
      
        
    
    
      </style>
    </head>
    <body>
      <div class="body">
        <div class="title">
          <h2>Hey ${findUser.userName}!</h2>
        </div>
        <div class="container">
          <div class="message">
            <div class="messageIn">
              <div class="messageImg">
                <img src="cid:password" alt="">
              </div>
              <h3>Forgot your password?</h3>
              <p class="p1">Don't worry, we got you! Just click the button below to reset your password.</p>
              <div class="a">
                <a href="http://localhost:3000/reset-password/${getToken}">RESET YOUR PASSWORD</a>
              </div>
              </div>
          </div>
          <div class="socials">
            <img src="cid:github" alt="">
            <img src="cid:instagram" alt="">
            <img src="cid:twitter" alt="">
          </div>
          <div class="bottom">
            <p>Problems or questions? Please call us at <a class="href1" href="tel:+5493813003200">+54 9 3813003200</a></p>
            <p>or email us at <a class="href2" href="mailto:tekitekihenry@gmail.com">tekitekihenry@gmail.com</a></p>
            <p class="p2">3003 Tekinapolis Street, Tekilandia, TK 3333</p>
          </div>
        </div>
      </div>
    </body>
    </html>`;

    let data = {
      to: findUser.email,
      subject: `TekiTeki Support`,
      html: HTML,
    };

    sendMail(data);

    return {msg: "Forgot password email sent"};

  }catch(error){
    console.log(error);
  }
};

module.exports = userController;