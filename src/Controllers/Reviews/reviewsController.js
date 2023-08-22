const Reviews = require("../../Models/ReviewsModel/ReviewsModel");

const reviewsController = () => {};


reviewsController.getAllReviews = async() =>{
  try{
    const getReviews = await Reviews.findAll();

    return {data: getReviews}
  }catch(error){
    console.log(error);
  }
}


reviewsController.createReview = async(review) =>{
  try{

    // We validate if the user already gave a review for the product, only one per user is allowed.
    const reviewExist = await Reviews.findOne({
      where:{
        belongsTo: review.belongsTo,
        productId: review.productId
      }
    });

    if(reviewExist){
      return {msg: "This user already gave a review for this product"};
    }

    const createReview = await Reviews.create(review);

    return {msg: "Review created", data: createReview.dataValues};

  }catch(error){
    console.log(error);
  }
}


reviewsController.deleteReview = async(reviewId) =>{
  try{
    const findReview = await Reviews.findOne({
      where: {
        id: reviewId
      }
    });

    if(!findReview){
      return {msg:"Review doesn't exist"}
    };

    await findReview.destroy();

    return {msg: "Review deleted", data: reviewId};

  }catch(error){
    console.log(error);
  }
}


reviewsController.banReview = async(reviewId) =>{
// El ban actua como un toggle, si la propiedad BANNED de la review,
// esta en TRUE, la pone en FALSE, y viceversa.
  try{
    const findReview = await Reviews.findOne({
      where: {
        id: reviewId
      }
    });

    if(!findReview){
      return {msg:"Review doesn't exist"}
    };

    await findReview.update({
      banned: !findReview.banned
    });

    await findReview.save();

    return {
      msg: `${findReview.banned ? "Review banned" : "Review active"}`, 
      data: reviewId
    };

  }catch(error){
    console.log(error);
  }

}





module.exports = reviewsController;