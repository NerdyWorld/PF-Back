const { Router } = require("express");
const userHandler = require("../../Handlers/Users/userHandler");


const userRouter = Router();


userRouter.post("/login", userHandler.loginUserHandler)
userRouter.put("/update", userHandler.updateUserHandler)
userRouter.delete("/disable/:userId", userHandler.disableUserHandler)
userRouter.delete("/delete/:userId", userHandler.deleteUserHandler)
userRouter.get("/get-user", userHandler.getUserHandler)
userRouter.get("/get-all-users", userHandler.getAllUsersHandler)


module.exports = userRouter;