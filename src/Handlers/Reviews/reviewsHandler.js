const reviewsController = require("../../Controllers/Reviews/reviewsController");

const reviewsHandler = () => {};


reviewsHandler.getAllReviews = async(req, res) =>{

  const response = await reviewsController.getAllReviews();

  res.status(200).json(response);
}


reviewsHandler.createReview = async(req, res) =>{

  const response = await reviewsController.createReview(req.body);


  if(response.msg === "This user already gave a review for this product"){
    res.status(500).json(response);
  }else{
    res.status(200).json(response)
  }
}


reviewsHandler.deleteReview = async(req, res) =>{

  const response = await reviewsController.deleteReview(req.params.reviewId);

  if(response.msg === "Review doesn't exist"){
    res.status(500).json(response);
  }else{
    res.status(200).json(response)
  }
}


reviewsHandler.banReview = async(req, res) =>{
// El ban actua como un toggle, si la propiedad BANNED de la review,
// esta en TRUE, la pone en FALSE, y viceversa.

const response = await reviewsController.banReview(req.params.reviewId);

  if(response.msg === "Review doesn't exist"){
    res.status(500).json(response);
  }else{
    res.status(200).json(response)
  }

}





module.exports = reviewsHandler;