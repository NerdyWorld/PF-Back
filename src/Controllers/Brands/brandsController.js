const Brands = require("../../Models/BrandsModel/BrandsModel");

const brandsController = () => {};


brandsController.createBrand = async(brand) =>{
  try{
    const brandExist = await Brands.findOne({
      where:{
        name: brand.name
      }
    });

    if(brandExist){
      return {msg: "Brand already exist"}
    };

    const createBrand = await Brands.create(brand);

    return {msg: "Brand created", data: createBrand.dataValues}

  }catch(error){
    console.log(error);
  }
};


brandsController.deleteBrand = async(brandId) =>{
  try{
    const brandExist = await Brands.findOne({
      where: {
        id: brandId
      }
    });
  
    if(!brandExist){
      return {msg: "Brand not found"}
    };
  
    const deleteBrand = await brandExist.destroy();
  
    return {msg: "Brand deleted", data: brandId};

  }catch(error){
    console.log(error);
  }

};



brandsController.getAllBrands = async() =>{
  try{
    const getAllBrands = await Brands.findAll();
  
    return {data: getAllBrands}
    
  }catch(error){
    console.log(error);
  }
};




module.exports = brandsController;