const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../../db.js")

const Products = sequelize.define(
  "Products",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false
    },
    color: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    categories: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    images: {
      type: DataTypes.TEXT, 
      get: function() {
          return JSON.parse(this.getDataValue('images'));
      }, 
      set: function(val) {
          return this.setDataValue('images', JSON.stringify(val));
      }
    },
    stock: {
      type: DataTypes.TEXT, 
      get: function() {
          return JSON.parse(this.getDataValue('stock'));
      }, 
      set: function(val) {
          return this.setDataValue('stock', JSON.stringify(val));
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    priceARS: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    priceUSD: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    priceEU: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    SKU: {
      type: DataTypes.STRING,
      allowNull: false
    }
  
  },
  {
    timestamps: false,
  }
);

module.exports = Products;