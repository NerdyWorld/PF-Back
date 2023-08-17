const { Router } = require("express");
const colorsHandler = require("../../Handlers/Colors/colorsHandler");

const colorRouter = Router();



colorRouter.post("/create", colorsHandler.createColor)
colorRouter.delete("/delete/:colorId", colorsHandler.deleteColor)
colorRouter.get("/get-all-colors", colorsHandler.getAllColors)



module.exports = colorRouter;