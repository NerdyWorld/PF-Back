const { Router } = require("express");
const userHandler = require("../../Handlers/Users/userHandler");


const userRouter = Router();




userRouter.post("/create", userHandler.createUserHandler)
userRouter.post("/login", userHandler.loginUserHandler)
userRouter.post("/googleAuth", userHandler.googleAuthHandler)
userRouter.post("/githubAuth/:gitCode", userHandler.githubAuthHandler)
userRouter.put("/update/:userId", userHandler.updateUserHandler)
userRouter.delete("/disable/:userId", userHandler.disableUserHandler)
userRouter.delete("/delete/:userId", userHandler.deleteUserHandler)
userRouter.post("/get-users", userHandler.getUserHandler)
userRouter.get("/get-all-users", userHandler.getAllUsersHandler)
userRouter.post("/forgot-password", userHandler.forgotPasswordHandler)
userRouter.put("/fav-toggle/:userId", userHandler.favToggleHandler)
userRouter.put("/cart-toggle/:userId", userHandler.cartToggleHandler)
userRouter.post("/activationCode", userHandler.sendActivationCodeHandler)
userRouter.post("/validateCredentials", userHandler.validateCredentialsHandler)
userRouter.post("/contactPreferences", userHandler.contactPreferenceHandler)


module.exports = userRouter;