const { Router } = require("express");
const ordersHandler = require("../../Handlers/Orders/ordersHandler");

const orderRouter = Router();



orderRouter.post("/create", ordersHandler.createOrder)
orderRouter.put("/update", ordersHandler.updateOrder)
orderRouter.get("/get-user-order/:userId", ordersHandler.getUserOrders)
orderRouter.get("/get-all-orders", ordersHandler.getAllOrders)
orderRouter.delete("/delete/:id", ordersHandler.deleteOrderById)



module.exports = orderRouter;