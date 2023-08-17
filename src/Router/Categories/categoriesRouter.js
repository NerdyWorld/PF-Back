const { Router } = require("express");
const categoriesHandler = require("../../Handlers/Categories/categoriesHandler");

const categoriesRouter = Router();



categoriesRouter.post("/create", categoriesHandler.createCategory)
categoriesRouter.delete("/delete/:categoryId", categoriesHandler.deleteCategory)
categoriesRouter.get("/get-all-categories", categoriesHandler.getAllCategories)



module.exports = categoriesRouter;