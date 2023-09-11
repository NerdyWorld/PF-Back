const axios = require("axios");
const uniqId = require("uniqid");
const { Op } = require('sequelize');

const Colors = require("../../Models/ColorsModel/colorsModel");

const Products = require("../../Models/ProductModel/productModel");

const productController = () => {};


productController.getAllProducts = async() =>{
  try{
    // Para poner colores en la db
    // let colorsArray = [];
    // const getProducts = await Products.findAll();
    // getProducts.map(product => {
    //     product.colors.map(color => {
    //       const findColor = colorsArray.find(item => item === color);
    //       if(!findColor){
    //         colorsArray.push(color);
    //       }
    //   })
    // });

    // colorsArray.map(async(el) => {
    //   const createColor = await Colors.create({
    //     name: el
    //   });
    // });

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


productController.fetchProductsToDb = async() =>{
  try{
    const filteredProducts = [];
    const getProducts = await axios("https://fashionapi.up.railway.app/all/blsmgfdk2512196430032000");
    
    (async()=>{
      getProducts.data.map(async(product) => {
        const findProduct = filteredProducts.find(el => el.name === product.name);
          
        if(!findProduct) filteredProducts.push(product);
      });
    })();

    if(filteredProducts.length){
      filteredProducts.map(async(product) => {
        product.SKU = uniqId();
      
        await Products.create(product);
      })
    };

    return {msg:"Products Fetched to Db"};

  }catch(error){
    console.log(error);
  }
}


productController.filterProducts = async(fields) =>{

  const { brand, category, color, priceMin, priceMax } = fields;
  console.log(brand);
  try{
    let filteredProducts = [];

    if(category){
      const filter = await Products.findAll({
        where: {
          categories: {
            [Op.contains]: [category]
          }
        }
      });
      if(!filter.length){
        return {msg: "No products found", data: []};
      }else{
        filteredProducts = filter;
      };
    }
    if(color){
      if(filteredProducts.length){
        const filter = filteredProducts.filter(el => el.colors.includes(color));

        if(!filter.length){
          return {msg: "No products found", data: []};
        }else{
          filteredProducts = filter;
        };
      }else{
        const filter = await Products.findAll({
          where: {
            colors: {
              [Op.contains]: [color]
            }
          }
        });
        if(!filter.length){
          return {msg: "No products found", data: []};
        }else{
          filteredProducts = filter;
        };
      }
    };
    if(priceMin && priceMax){
      if(filteredProducts.length){
        const filter = filteredProducts.filter(el => Number(el.price) > priceMin && Number(el.price) < priceMax);

        if(!filter.length){
          return {msg: "No products found", data: []};
        }else{
          filteredProducts = filter;
        };
      }else{
        const findAll = await Products.findAll();
        
        const filter = findAll.filter(el => Number(el.price) > priceMin && Number(el.price) < priceMax);

        if(!filter.length){
          return {msg: "No products found", data: []};
        }else{
          filteredProducts = filter;
        }
      }
    };

    const filterByBrand = filteredProducts.filter(el => el.brand === brand);
    if(!filterByBrand.length){
      return {msg: "No products found", data: []};
    }else{
      filteredProducts = filterByBrand;
    }


    return {msg: "Products filtered", data: filteredProducts, length: filteredProducts.length};
    

  }catch(error){
    console.log(error);
  }
}


module.exports = productController;