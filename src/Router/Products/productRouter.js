const { Router } = require("express");
const productHandler = require("../../Handlers/Products/productHandler");

const productRouter = Router();



productRouter.post("/create", productHandler.createProduct)
productRouter.put("/update", productHandler.updateProduct)
productRouter.delete("/delete/:productId", productHandler.deleteProduct)
productRouter.get("/get-all-products", productHandler.getAllProducts)


productRouter.post("/filter-products", productHandler.filterProducts)


productRouter.get("/fetch-products-to-db", productHandler.fetchProductToDb)


module.exports = productRouter;