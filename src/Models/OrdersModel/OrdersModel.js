const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../../db.js")

const Orders = sequelize.define(
  "Orders",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    belongsTo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    orderStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false
    },
    shippingAddress:{
      type: DataTypes.TEXT,
      allowNull: false
    },
    billingAddress:{
      type: DataTypes.TEXT,
      allowNull: false
    },
    shippingMethod:{
      type: DataTypes.STRING,
      allowNull: false
    },
    items: {
      type: DataTypes.TEXT, 
      get: function() {
          return JSON.parse(this.getDataValue('items'));
      }, 
      set: function(val) {
          return this.setDataValue('items', JSON.stringify(val));
      }
    },
    
  },
  {
    timestamps: true,
  }
);

module.exports = Orders;