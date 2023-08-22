const brandsController = require("../../Controllers/Brands/brandsController");

const brandsHandler = () => {};


brandsHandler.createBrand = async(req, res) =>{

  const response = await brandsController.createBrand(req.body);

  if(response.msg === "Brand already exist"){
    res.status(500).json(response);
  }else{
    res.status(200).json(response);
  }
};


brandsHandler.deleteBrand = async(req, res) =>{

  const response = await brandsController.deleteBrand(req.params.brandId);

  if(response.msg === "Brand not found"){
    res.status(500).json(response);
  }else{
    res.status(200).json(response);
  }
};



brandsHandler.getAllBrands = async(req, res) =>{
  
  const response = await brandsController.getAllBrands();

  res.status(200).json(response);
  
};




module.exports = brandsHandler;
