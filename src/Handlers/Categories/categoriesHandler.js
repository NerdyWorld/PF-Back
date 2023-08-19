const categoriesController = require("../../Controllers/Categories/categoriesController");

const categoriesHandler = () => {};


categoriesHandler.createCategory = async(req, res) =>{
  const response = await categoriesController.createCategory(req.body);

  if(response.msg === "Category already exist"){
    res.status(500).json(response);
  }else{
    res.status(200).json(response);
  }
};


categoriesHandler.deleteCategory = async(req, res) =>{

  const response = await categoriesController.deleteCategory(req.params.categoryId);

  if(response.msg === "Category not found"){
    res.status(500).json(response);
  }else{
    res.status(200).json(response);
  }

};



categoriesHandler.getAllCategories = async(req, res) =>{

  const response = await categoriesController.getAllCategories();

  res.status(200).json(response);
  
};




module.exports = categoriesHandler;
