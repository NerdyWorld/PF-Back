const stripe = require("stripe")("sk_test_51Nfq2FGZz86c4aljFOwcF0MXcEMNCPycvaiy1Sk4Ag3au3rPbRIUKDiWpP4uNXl28mtwqjDHV5BR6zWncbP0YTG40061CDIglI");
const { Router } = require("express");

const stripeRouter = Router();


// WE GET OUR CLIENT SECRET
stripeRouter.post("/create-payment-intent", async(req, res)=>{

  const { currency, amount } = req.body.data;

  try{
    const paymentIntent = await stripe.paymentIntents.create({
      currency: currency,
      amount: amount,
      automatic_payment_methods: { enabled: true }
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret
    })

  }catch(error){
    res.status(500).json({
      msg: error.message
    });
    console.log(error);
  }
})


module.exports = stripeRouter;