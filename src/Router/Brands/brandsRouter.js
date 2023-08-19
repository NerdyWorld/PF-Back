const { Router } = require("express");
const brandsHandler = require("../../Handlers/Brands/brandsHandler");

const brandRouter = Router();



brandRouter.post("/create", brandsHandler.createBrand)
brandRouter.delete("/delete/:brandId", brandsHandler.deleteBrand)
brandRouter.get("/get-all-colors", brandsHandler.getAllBrands)



module.exports = brandRouter;