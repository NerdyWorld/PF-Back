const ordersController = require("../../Controllers/Orders/orderController");

const ordersHandler = () => {};


ordersHandler.createOrder = async(req, res) =>{

  const response = await ordersController.createOrder(req.body);

  if(response.msg === "Order created"){
    res.status(200).json(response);
  }else{
    res.status(500).json({msg: "Error creating the order"});
  }
};


ordersHandler.updateOrder = async(req, res) =>{

  const response = await ordersController.updateOrder(req.body);

  if(response.msg === "Order not found"){
    res.status(500).json(response);
  }else{
    res.status(200).json(response);
  }

};


ordersHandler.getUserOrders = async(req, res) =>{

  const response = await ordersController.getUserOrders(req.params.userId);

  res.status(200).json(response);
  
};


ordersHandler.getAllOrders = async(req, res) =>{

  const response = await ordersController.getAllOrders();

  res.status(200).json(response);
};


ordersHandler.deleteOrderById = async (req, res) => {
  const { id } = req.params; 

  const result = await ordersController.deleteOrderById(id);

  if (result.error) {
    return res.status(404).json({ error: result.error });
  }

  res.status(200).send({ message: result.success , id});
};





module.exports = ordersHandler;
