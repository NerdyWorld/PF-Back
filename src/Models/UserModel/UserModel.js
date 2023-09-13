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
      allowNull: false,
      defaultValue: false
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false
    },
    googleUser:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    githubUser:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    logged: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    birthday: {
      type: DataTypes.DATE,
      allowNull: true
    },
    contactPreferences: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: []
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Users;