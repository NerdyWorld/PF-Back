const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../../db.js")

const Users = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cart: {
      type: DataTypes.TEXT, 
      get: function() {
          return JSON.parse(this.getDataValue('cart'));
      }, 
      set: function(val) {
          return this.setDataValue('cart', JSON.stringify(val));
      }
    },
    favorites: {
      type: DataTypes.TEXT, 
      get: function() {
          return JSON.parse(this.getDataValue('favorites'));
      }, 
      set: function(val) {
          return this.setDataValue('favorites', JSON.stringify(val));
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    googleUser:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Users;