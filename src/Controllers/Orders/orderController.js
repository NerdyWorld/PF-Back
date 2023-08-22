const Orders = require("../../Models/OrdersModel/OrdersModel");

const ordersController = () => {};


ordersController.createOrder = async(order) =>{
  try{
    const createOrder = await Orders.create(order);

    return {msg: "Order created", data: createOrder.dataValues}

  }catch(error){
    console.log(error);
  }
};


ordersController.updateOrder = async(data) =>{
  // UPDATE ONLY THE STATUS ORDER
  try{
    const findOrder = await Orders.findOne({
      where:{
        id: data.id
      }
    });

    if(!findOrder){
      return {msg: "Order not found"}
    };

    await findOrder.update({
      status: data.status
    });

    await findOrder.save();

    return {msg: `Order status updated to: ${data.status}`, data: findOrder};

  }catch(error){
    console.log(error);
  }

};


ordersController.getUserOrders = async(userId) =>{
  try{
    const findUserOrders = await Orders.findAll({
      where: {
        belongsTo: userId
      }
    });

    return {data: findUserOrders}
  }catch(error){
    console.log(error);
  }
};


ordersController.getAllOrders = async() =>{
  try{
    const findUserOrders = await Orders.findAll();

    return {data: findUserOrders}
    
  }catch(error){
    console.log(error);
  }
};




module.exports = ordersController;