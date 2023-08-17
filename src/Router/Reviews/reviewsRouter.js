const { Router } = require("express");
const reviewsHandler = require("../../Handlers/Reviews/reviewsHandler");

const reviewsRouter = Router();



reviewsRouter.post("/create", reviewsHandler.createReview)
reviewsRouter.delete("/delete/:reviewId", reviewsHandler.deleteReview)
reviewsRouter.delete("/ban/:reviewId", reviewsHandler.banReview)
reviewsRouter.get("/get-all-products", reviewsHandler.getAllReviews)



module.exports = reviewsRouter;