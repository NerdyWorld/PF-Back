const Products = require("../../Models/ProductModel/productModel");

const productController = () => {};


productController.getAllProducts = async() =>{
  try{
    const getProducts = await Products.findAll();

    return {data: getProducts};
  }catch(error){
    console.log(error);
  }
}


productController.createProduct = async(product) =>{
  try{
    const productExist = await Products.findOne({
      where:{
        name: product.name
      }
    });

    if(productExist){
      return {msg:"Product already exist"};
    }

    const createProduct = await Products.create(product);

    return {msg:"Product created", data: createProduct.dataValues};

  }catch(error){
    console.log(error);
  }
}


productController.updateProduct = async(data) =>{
  try{

    const findProduct = await Products.findOne({
      where:{
        id: data.id
      }
    });

    if(!findProduct){
      return {msg: "Product not found"};
    };
    if(findProduct.name === data.name){
      return {msg: "Product already exist"};
    };
    
    await findProduct.update(data);

    await findProduct.save();

    return {msg:"Product updated", data: findProduct};

  }catch(error){
    console.log(error);
  }
}


productController.deleteProduct = async(productId) =>{
  try{
    const findProduct = await Products.findOne({
      where: {
        id: productId
      }
    });

    if(!findProduct){
      return {msg:"Product not found"};
    };

    await findProduct.destroy();

    return {msg:"Product deleted", data: productId};

  }catch(error){
    console.log(error);
  }
}


module.exports = productController;