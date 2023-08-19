const Categories = require("../../Models/CategoriesModel/categoriesModel");

const categoriesController = () => {};


categoriesController.createCategory = async(category) =>{
  try{
    const categoryExist = await Categories.findOne({
      where:{
        name: category.name
      }
    });

    if(categoryExist){
      return {msg: "Category already exist"}
    };

    const createCategory = await Categories.create(category);

    return {msg: "Category created", data: createCategory.dataValues}

  }catch(error){
    console.log(error);
  }
};


categoriesController.deleteCategory = async(categoryId) =>{
  try{
    const categoryExist = await Categories.findOne({
      where: {
        id: categoryId
      }
    });
  
    if(!categoryExist){
      return {msg: "Category not found"}
    };
  
    const deleteCategory = await categoryExist.destroy();
  
    return {msg: "Category deleted", data: categoryId};

  }catch(error){
    console.log(error);
  }

};



categoriesController.getAllCategories = async() =>{
  try{
    const getAllCategories = await Categories.findAll();
  
    return {data: getAllCategories}

  }catch(error){
    console.log(error);
  }
};




module.exports = categoriesController;