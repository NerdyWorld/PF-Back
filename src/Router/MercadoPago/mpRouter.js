const { Router } = require("express");
const mercadopago= require("mercadopago");

const mercadoPagoRouter = Router();



// Configure MercadoPago
mercadopago.configure({
  access_token:
    "TEST-5560570626097728-072022-b846d996aec1526cb840190799711653-307905530",
});

mercadoPagoRouter.post("/create_preference", (req, res) => {
  let getItems = req.body.items;

  
  let preference = {
    items: getItems,

    // Back URLs will redirect the user after the payment process.
    back_urls: {
      success: "http://localhost:3000/home",
      failure: "http://localhost:3000/home",
      pending: "http://localhost:3000/home",
    },
    auto_return: "approved",
  };


  mercadopago.preferences
    .create(preference)
    .then((response) => {
      res.json({
        id: response.body.id,
      });
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while creating the preference." });
    });
});

module.exports = mercadoPagoRouter;