const Colors = require("../../Models/ColorsModel/colorsModel");

const colorsController = () => {};


colorsController.createColor = async(color) =>{
  try{
    const colorExist = await Colors.findOne({
      where:{
        name: color.name
      }
    });

    if(colorExist){
      return {msg: "Color already exist"}
    };

    const createColor = await Colors.create(color);

    return {msg: "Color created", data: createColor.dataValues}

  }catch(error){
    console.log(error);
  }
};


colorsController.deleteColor = async(colorId) =>{
  try{
    const colorExist = await Colors.findOne({
      where: {
        id: colorId
      }
    });
  
    if(!colorExist){
      return {msg: "Color not found"}
    };
  
    const deleteColor = await colorExist.destroy();
  
    return {msg: "Color deleted", data: colorId};

  }catch(error){
    console.log(error);
  }

};



colorsController.getAllColors = async() =>{

  try{
    const getAllColors = await Colors.findAll();
  
    return {data: getAllColors}

  }catch(error){
    console.log(error);
  }
};




module.exports = colorsController;