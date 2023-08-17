



const Brands = require("./BrandsModel/BrandsModel");
const Categories = require("./CategoriesModel/categoriesModel");
const Colors = require("./ColorsModel/colorsModel");
const Orders = require("./OrdersModel/OrdersModel");
const Products = require("./ProductModel/productModel");
const Reviews = require("./ReviewsModel/ReviewsModel");
const Users = require("./UserModel/UserModel");


// USER RELATIONS
Users.hasMany(Orders)
Users.hasMany(Reviews)



// PRODUCT RELATIONS
Products.hasMany(Categories)
Products.hasMany(Colors)
Products.hasOne(Brands)



// ORDER RELATIONS
Orders.belongsTo(Users)



// REVIEWS RELATIONS
Reviews.belongsTo(Users)



// COLOR RELATIONS
Colors.belongsTo(Products)



// CATEGORIES RELATIONS
Categories.belongsTo(Products)



// BRANDS RELATIONS
Brands.belongsTo(Products)




module.exports = {
  Users,
  Products,
  Orders,
  Reviews,
  Colors,
  Brands,
  Categories
}