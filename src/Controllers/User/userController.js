require("dotenv").config();
const Users = require("../../Models/UserModel/UserModel");
const sendMail = require("../../Utils/emailCtrl");
const generateToken = require("../../Utils/jwtEncode");
const axios = require("axios");
const uniqid = require("uniqid");
const bcrypt = require("bcrypt");

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

const userController = () => {};

userController.createUser = async (user) => {
  try {
    // VALIDATE IF THE EMAIL OR USER IS IN USE
    const validateEmail = await Users.findOne({
      where: {
        email: user.email,
      },
    });

    const validateUsername = await Users.findOne({
      where: {
        userName: user.userName,
      },
    });

    if (validateEmail) {
      if (validateEmail.googleUser) {
        return {
          msg: "There is a Google Account associated with this email, try logging in with Google!",
        };
      }
      if (validateEmail.githubUser) {
        return {
          msg: "There is a GitHub Account associated with this email, try logging in with GitHub!",
        };
      }

      return { msg: "There is an account associated with this email!" };
    }
    if (validateUsername) {
      return { msg: "Username Error" };
    }

    // CREATE THE USER

    const hashedPassword = bcrypt.hashSync(user.password, 10);

    const createUser = await Users.create({
      ...user,
      password: hashedPassword,
    });
    const encodedUserId = generateToken(createUser.dataValues.id);
    return {
      msg: "User created",
      data: { ...createUser.dataValues, encodedId: encodedUserId },
    };
  } catch (error) {
    console.log(error);
  }
};

userController.loginUser = async (user) => {
  try {
    const { credential, password } = user;

    const findUserByEmail = await Users.findOne({
      where: {
        email: credential,
      },
    });

    const findUserByUsername = await Users.findOne({
      where: {
        userName: credential,
      },
    });

    if (!findUserByEmail && !findUserByUsername) {
      if (credential.includes("@")) {
        return { msg: "Email Incorrect" };
      } else {
        return { msg: "Username Incorrect" };
      }
    }

    if (findUserByEmail || findUserByUsername) {
      const userFound = findUserByEmail ? findUserByEmail : findUserByUsername;
      if (userFound.googleUser) {
        return {
          msg: "This email is associated with a Google account, please try logging in with Google",
        };
      }
      if (userFound.githubUser) {
        return {
          msg: "This email is associated with a GitHub account, please try logging in with GitHub",
        };
      }

      // If is not associated with a Google or Github account
      const match = bcrypt.compareSync(password, userFound.dataValues.password);
      if (match) {
        // Logged succesfully
        const encodedUserId = generateToken(userFound.dataValues.id);
        return {
          msg: "User logged",
          data: { ...userFound.dataValues, encodedId: encodedUserId },
        };
      } else {
        // Wrong Password
        return { msg: "Password Incorrect" };
      }
    }
  } catch (error) {
    console.log(error);
  }
};
userController.adminLogin = async (user) => {
  try {
    const { credential, password } = user;

    const findUserByEmail = await Users.findOne({
      where: {
        email: credential,
      },
    });

    const findUserByUsername = await Users.findOne({
      where: {
        userName: credential,
      },
    });

    if (!findUserByEmail && !findUserByUsername) {
      if (credential.includes("@")) {
        return { msg: "Email Incorrect" };
      } else {
        return { msg: "Username Incorrect" };
      }
    }

    if (findUserByEmail || findUserByUsername) {
      const userFound = findUserByEmail ? findUserByEmail : findUserByUsername;
      if (userFound.googleUser) {
        return {
          msg: "This email is associated with a Google account, please try logging in with Google",
        };
      }
      if (userFound.githubUser) {
        return {
          msg: "This email is associated with a GitHub account, please try logging in with GitHub",
        };
      }

      // If is not associated with a Google or Github account
      const match = bcrypt.compareSync(password, userFound.dataValues.password);
      if (match) {
        // Logged succesfully
        const encodedUserId = generateToken(userFound.dataValues.id);
        if (userFound.admin) {
          return {
            msg: "User logged",
            data: { ...userFound.dataValues, encodedId: encodedUserId },
          };
        } else {
          return { msg: "Invalid credentials for admin" };
        }
      } else {
        // Wrong Password
        return { msg: "Password Incorrect" };
      }
    }
  } catch (error) {
    console.log(error);
  }
};

userController.googleAuthAdmin = async (user) => {
  console.log(user);

  try {
    const userExist = await Users.findOne({
      where: {
        email: user.email,
      },
    });

    // ACCOUNT ALREADY ASSOCIATED WITH GOOGLE EMAIL
    if (userExist && !userExist.googleUser) {
      return { msg: "Account already associated with Google Email" };
    }

    // LOG USER
    if (userExist && userExist.googleUser && userExist.admin) {
      const encodedUserId = generateToken(userExist.dataValues.id);

      await userExist.update({
        logged: true,
      });

      await userExist.save();
      console.log(userExist);

      return {
        msg: "Google user logged",
        data: { ...userExist.dataValues, encodedId: encodedUserId },
      };
    } else {
      if (userExist && userExist.googleUser) {
        return { msg: "Invalid credentials for admin" };
      }
    }
  } catch (error) {
    return { msg: "Account doesnt exist" };
  }
};

userController.googleAuth = async (user) => {
  console.log(user);

  try {
    const userExist = await Users.findOne({
      where: {
        email: user.email,
      },
    });

    // ACCOUNT ALREADY ASSOCIATED WITH GOOGLE EMAIL
    if (userExist && !userExist.googleUser) {
      return { msg: "Account already associated with Google Email" };
    }

    // LOG USER
    if (userExist && userExist.googleUser) {
      const encodedUserId = generateToken(userExist.dataValues.id);

      await userExist.update({
        logged: true,
      });

      await userExist.save();
      console.log(userExist);

      return {
        msg: "Google user logged",
        data: { ...userExist.dataValues, encodedId: encodedUserId },
      };
    }

    // REGISTER USER
    if (!userExist) {
      const createUser = await Users.create({
        userName: user.userName,
        firstName: user.firstName || "-google",
        lastName: user.lastName || "-google",
        email: user.email,
        password: uniqid(),
        avatar: "/images/googleLogo.svg",
        googleUser: true,
        logged: true,
        verified: true,
        genre: "Not specified",
        birthday: "000",
      });

      const encodedUserId = generateToken(createUser.dataValues.id);
      console.log(createUser.dataValues);

      return {
        msg: "Google user created",
        data: { ...createUser.dataValues, encodedId: encodedUserId },
      };
    }
  } catch (error) {
    console.log(error);
  }
};

userController.githubAuth = async (gitCode) => {
  try {
    const params = `?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${gitCode}`;

    // OBTENEMOS TOKEN
    const getAccessToken = await axios.post(
      `https://github.com/login/oauth/access_token${params}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    // PARSEAMOS EL TOKEN
    const accessToken = getAccessToken.data.split("=")[1].split("&")[0];

    // OBTENEMOS DATOS Y EMAIL
    const getUserData = await axios("https:/api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const getUserEmail = await axios("https:/api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // LOGIN OR REGISTER

    const userRegistered = await Users.findOne({
      where: {
        email: getUserEmail.data[0].email,
      },
    });
    if (userRegistered && !userRegistered.githubUser) {
      return {
        msg: "There is an account associated with your GitHub email, please try logging in manually!",
      };
    }
    if (userRegistered) {
      // Already registered, so we log the user.
      const encodedUserId = generateToken(userRegistered.dataValues.id);

      await userRegistered.update({
        logged: true,
      });

      await userRegistered.save();

      return {
        msg: "Github user logged",
        data: { ...userRegistered, encodedId: encodedUserId },
      };
    }

    // Not registered, so we register the user.
    const createUser = await Users.create({
      userName: getUserData.data.login,
      avatar: "/images/githubUser.svg",
      email: getUserEmail.data[0].email,
      githubUser: true,
      googleUser: false,
      password: uniqid(),
      firstName: "-github",
      lastName: "-github",
      logged: true,
      verified: true,
      genre: "Not specified",
      birthday: "000",
    });

    const encodedUserId = generateToken(createUser.dataValues.id);

    return {
      msg: "Github user created",
      data: { ...createUser.dataValues, encodedId: encodedUserId },
    };
  } catch (error) {
    console.log(error);
  }
};
userController.githubAuth = async (gitCode) => {
  try {
    const params = `?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${gitCode}`;

    // OBTENEMOS TOKEN
    const getAccessToken = await axios.post(
      `https://github.com/login/oauth/access_token${params}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    // PARSEAMOS EL TOKEN
    const accessToken = getAccessToken.data.split("=")[1].split("&")[0];

    // OBTENEMOS DATOS Y EMAIL
    const getUserData = await axios("https:/api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const getUserEmail = await axios("https:/api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // LOGIN OR REGISTER

    const userRegistered = await Users.findOne({
      where: {
        email: getUserEmail.data[0].email,
      },
    });
    if (userRegistered && !userRegistered.githubUser) {
      return {
        msg: "There is an account associated with your GitHub email, please try logging in manually!",
      };
    }
    if (userRegistered && userRegistered.admin) {
      // Already registered, so we log the user.
      const encodedUserId = generateToken(userRegistered.dataValues.id);

      await userRegistered.update({
        logged: true,
      });

      await userRegistered.save();

      return {
        msg: "Github user logged",
        data: { ...userRegistered, encodedId: encodedUserId },
      };
    } else if (userRegistered) {
      return { msg: "Invalid credentials for admin" };
    }
  } catch (error) {
    console.log(error);
  }
};

userController.updateUser = async (newUser, userId) => {
  // return console.log(newUser);
  try {
    const findUser = await Users.findOne({
      where: {
        id: userId.toString(),
      },
    });

    if (!findUser) {
      return { msg: "No user found" };
    }

    if (newUser.password) {
      const hashedPassword = bcrypt.hashSync(newUser.password, 10);
      newUser.password = hashedPassword;
    }

    await findUser.update(newUser);

    await findUser.save();

    const getAllUsers = await Users.findAll();

    return { msg: "User updated", data: findUser, allData: getAllUsers };
  } catch (error) {
    console.log(error);
  }
};

userController.deleteUser = async (userId) => {
  try {
    const deleteUser = await Users.destroy({
      where: {
        id: userId,
      },
    });

    return { msg: "User deleted", data: userId };
  } catch (error) {
    console.log(error);
  }
};

userController.disableUser = async (userId) => {
  try {
    const findUser = await Users.findOne({
      where: {
        id: userId,
      },
    });

    if (!findUser) {
      return { msg: "User not found" };
    }

    if (findUser) {
      if (!findUser.disabled) {
        await findUser.update({
          disabled: true,
        });

        await findUser.save();

        return { msg: "User disabled", data: findUser };
      } else {
        await findUser.update({
          disabled: false,
        });

        await findUser.save();

        return { msg: "User activated", data: findUser };
      }
    }
  } catch (error) {
    console.log(error);
  }

  // El disable actua como un toggle, si la propiedad DISABLED del user,
  // esta en TRUE, la pone en FALSE, y viceversa.
};

userController.getUser = async (userId) => {
  try {
    const getUser = await Users.findOne({
      where: {
        id: userId,
      },
    });

    if (!getUser) {
      return { msg: "User not found" };
    }

    return { msg: "User found", data: getUser };
  } catch (error) {
    console.log(error);
  }
};

userController.getAllUsers = async () => {
  try {
    const getAllUsers = await Users.findAll();

    return { data: getAllUsers };
  } catch (error) {
    console.log(error);
  }
};

userController.forgotPassword = async (userEmail) => {
  try {
    const findUser = await Users.findOne({
      where: {
        email: userEmail,
      },
    });

    if (!findUser) {
      return { msg: "User not found" };
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
            <p>or email us at <a class="href2" href="mailto:rivellecompany@gmail.com">rivellecompany@gmail.com</a></p>
            <p class="p2">3003 Fashionapolis Street, Rivelandia, TK 3333</p>
          </div>
        </div>
      </div>
    </body>
    </html>`;

    let data = {
      to: findUser.email,
      subject: `Rivélle Support`,
      html: HTML,
      type: "forgotPasword",
    };

    sendMail(data);

    return { msg: "Forgot password email sent" };
  } catch (error) {
    console.log(error);
  }
};

userController.favToggle = async (item, userId) => {
  try {
    const findUser = await Users.findOne({
      where: {
        id: userId,
      },
    });

    if (!findUser) {
      return { msg: "User not found" };
    }

    let favorites = findUser.favorites || [];

    if (!favorites.length) {
      // Si no hay nada en favoritos, agrega directo
      favorites.push(item);
      await findUser.update({
        favorites,
      });
      await findUser.save();
      return { msg: "Item added to favs", data: findUser };
    } else if (favorites.length) {
      // Si hay items en favoritos, valida si el item ya existe
      const findItem = favorites.find((el) => el.id === item.id);

      if (findItem) {
        // Si el item existe lo saca
        let filter = favorites.filter((el) => el.id !== findItem.id);
        favorites = filter;

        await findUser.update({
          favorites,
        });
        await findUser.save();
        return { msg: "Item removed from favs", data: findUser };
      } else if (!findItem) {
        // Si el item no existe lo agrega
        favorites.push(item);
        await findUser.update({
          favorites,
        });
        await findUser.save();
        return { msg: "Item added to favs", data: findUser };
      }
    }
  } catch (error) {
    console.log(error);
  }
};

userController.cartToggle = async (item, userId) => {
  try {
    const findUser = await Users.findOne({
      where: {
        id: userId,
      },
    });

    if (!findUser) {
      return { msg: "User not found" };
    }

    let cart = findUser.cart || [];

    if (!cart.length) {
      // Si no hay nada en favoritos, agrega directo
      cart.push(item);
      await findUser.update({
        cart,
      });
      await findUser.save();
      return { msg: "Item added to cart", data: findUser };
    } else if (cart.length) {
      // Si hay items en favoritos, valida si el item ya existe
      const findItem = cart.find((el) => el.id === item.id);

      if (findItem) {
        // Si el item existe lo saca
        let filter = cart.filter((el) => el.id !== findItem.id);
        cart = filter;

        await findUser.update({
          cart,
        });
        await findUser.save();
        return { msg: "Item removed from cart", data: findUser };
      } else if (!findItem) {
        // Si el item no existe lo agrega
        cart.push(item);
        await findUser.update({
          cart,
        });
        await findUser.save();
        return { msg: "Item added to cart", data: findUser };
      }
    }
  } catch (error) {
    console.log(error);
  }
};

userController.sendActivationCode = async (data) => {
  try {
    console.log(data);
    const { email, activationCode, firstName } = data;
    if (!email || !activationCode || !firstName) {
      return { msg: "Missing fields" };
    }

    let HTML = `
    <!DOCTYPE html>
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Handlee&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100;200;300;400&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Raleway&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap" rel="stylesheet">
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
            background-color: white;
            width: 50%;
            margin-left: auto;
            margin-right: auto;
            padding-bottom: 1rem;
          }
          
          .header{
          margin-bottom: 2rem;
          }

          .header h2{
            font-family: Lexend;
            text-align: center;
            text-transform: uppercase;
            font-weight: 500;
            letter-spacing: 2.5px;
            padding-top: 2rem;
          }

          .header-bottom{
            padding-top: 2.5rem;
            text-align: center;
            border-bottom: 1px solid rgb(208, 206, 203);
            font-family: Roboto;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding-bottom: 0.5rem;
          }

          .header-bottom a{
            text-decoration: none;
            color: #1f1f1f;
            padding: 0rem 1rem;
            border-right: 1px solid rgb(208, 206, 203);
          }

          .message{
            font-family: Roboto;
            font-weight: 400;
            font-size: 12px;
            letter-spacing: 1px;
            color: #1f1f1f;
          }

          .message p{
            margin-bottom: 20px;
          }

          .message ul{
            margin-bottom: 1rem;
            padding: 0rem;
            padding-left: 1rem;
            list-style-type: square;
          }

          .message ul li{
            margin-bottom: 0.5rem;
          }

          .message a{
            color: #19110b;
          }

          .bottom{
            margin-top: 4rem;
            background-color: #f4f4f4;
            font-family: Roboto;
            font-size: 11px;
            letter-spacing: 1px;
            color: #777777;
            padding: 1.5rem 3rem;
          }

          .bottomItem1{
            text-align: center;
            margin-left: auto;
            margin-right: 20px;
          }

          .bottomItem2{
            text-align: center;
            margin-left: 20px;
            margin-right: auto;
          }

          .bottomItem1 p, .bottomItem2 p{
            margin-top: 1vh;
          }

          .bottomItem img{
            margin-bottom: 5px;
          }

          .bottomDiv{
            border-bottom: 1px solid #bbb9b9;
            padding: 1.5rem 0rem;
            display: flex;
          }

          .bottomDiv2{
            padding: 1.5rem 2rem;
            text-align: center;
            margin-top: 1rem;
          }

          .p1{
            margin-bottom: 1rem;
          }

          .p2{
            line-height: 20px;
          }

          .p1, .p2{
            font-size: 10px;
          }

          .bottomDiv2 a{
            color: #19110b;
          }

          .noBorder{
            border-right: none !important;
          }

        </style>
      </head>
      <body>
        <div class="body">
          <div class="header">
            <h2>Rivélle Company</h2>
            <div class="header-bottom">
              <a href="https://rivelle.netlify.app/home">Home</a>
              <a href="https://rivelle.netlify.app/store">Store</a>
              <a href="https://rivelle.netlify.app/collections/gucci">Gucci</a>
              <a href="https://rivelle.netlify.app/collections/louisVuitton">LV</a>
              <a href="https://rivelle.netlify.app/collections/jimmyChoo" class="noBorder">Jimmy Choo</a>
            </div>
          </div>
          <div class="message">
              <p>Dear ${firstName},</p>
              <p>Welcome to Rivelle. Your Rivelle account enables you to:</p>
              <ul>
                <li>Follow your online orders and access your purchase history and e-receipts</li>
                <li>Manage your personal information</li>
                <li>Receive the latest Rivelle digital communication</li>
                <li>Create your personal wishlist</li>
              </ul>
        
              <p>To complete your account creation, please enter the following verification code: <b>${activationCode}</b></p>
        
              <p>Your secured account will be registered with the following information:</p>
        
              <p>Email: <a href="mailto:${email}">${email}</a></p>
        
              <p>Experience the complete Louis Vuitton universe at <a href="https://rivelle.netlify.app">rivelle.netlify.app</a></p>
          </div>
          <div class="bottom">
            <div class="bottomDiv">
              <div class="bottomItem1">
                <a href="mailto:rivellecompany@gmail.com"><img src="cid:email" alt="abc" width="25"></a>
                <p>Email Us</p>
              </div>
              <div class="bottomItem2">
                <a href="tel:+1786300300"><img src="cid:phone" alt="abc" width="25"></a>
                <p>+1.786.RIVELLE</p>
              </div>
            </div>
            <div class="bottomDiv2">
              <p class="p1">Copyright © 2023 Rivelle Company</p>
              <p class="p2">
                You have the right to access, modify and cancel your personal information.
                To do so, please send an e-mail to <a href="mailto:rivellecompany@gmail.com">rivellecompany@gmail.com</a>
              </p>
            </div>
          </div>
      </body>
      </html>
    `;

    let dataSource = {
      to: email,
      subject: `Welcome to Rivelle!`,
      html: HTML,
      type: "activationCode",
    };

    sendMail(dataSource);

    return { msg: "Activation code sent" };
  } catch (error) {
    console.log(error);
  }
};

userController.validateCredentials = async (data) => {
  try {
    const { email, username } = data;

    const findByEmail = await Users.findOne({
      where: {
        email,
      },
    });

    const findByUsername = await Users.findOne({
      where: {
        userName: username,
      },
    });

    if (findByUsername) {
      return { msg: "Username in use" };
    }

    if (findByEmail) {
      return { msg: "Email in use" };
    }

    if (findByEmail && findByEmail.dataValues.googleUser) {
      return { msg: "Email in use with Google" };
    }

    if (findByEmail && findByEmail.dataValues.githubUser) {
      return { msg: "Email in use with Github" };
    }

    return { msg: "Credentials available" };
  } catch (error) {
    console.log(error);
  }
};

module.exports = userController;
