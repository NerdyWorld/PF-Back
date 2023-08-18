const { Router } = require("express");
const userHandler = require("../../Handlers/Users/userHandler");


const userRouter = Router();




userRouter.post("/create", userHandler.createUserHandler)
userRouter.post("/login", userHandler.loginUserHandler)
userRouter.put("/update/:userId", userHandler.updateUserHandler)
userRouter.delete("/disable/:userId", userHandler.disableUserHandler)
userRouter.delete("/delete/:userId", userHandler.deleteUserHandler)
userRouter.get("/get-all-users", userHandler.getAllUsersHandler)
userRouter.post("/forgot-password", userHandler.forgotPasswordHandler)


module.exports = userRouter;