const productController = require("../../Controllers/Products/productController");

const productHandler = () => {};


productHandler.getAllProducts = async(req, res) =>{

  const response = await productController.getAllProducts();

  res.status(200).json(response);
}


productHandler.createProduct = async(req, res) =>{

  const response = await productController.createProduct(req.body);

  if(response.msg === "Product already exist"){
    res.status(500).json(response);
  }else{
    res.status(200).json(response);
  }
}


productHandler.updateProduct = async(req, res) =>{

  const response = await productController.updateProduct(req.body);

  if(response.msg === "Product not found" || response.msg === "Product already exist"){
    res.status(500).json(response);
  }else{
    res.status(200).json(response);
  }
}


productHandler.deleteProduct = async(req, res) =>{

  const response = await productController.deleteProduct(req.params.productId);

  if(response.msg === "Product not found"){
    res.status(500).json(response);
  }else{
    res.status(200).json(response);
  }
}


productHandler.fetchProductToDb = async(req, res) =>{

  const response = await productController.fetchProductsToDb();

  if(response.msg === "Error fetching the product, check if the token is present on params!"){
    res.status(500).json(response);
  }else{
    res.status(200).json(response);
  }
}


productHandler.filterProducts = async(req, res) =>{

  const response = await productController.filterProducts(req.body);

  if(response.msg === "No products found"){
    res.status(500).json(response);
  }else{
    res.status(200).json(response);
  }
}


module.exports = productHandler;