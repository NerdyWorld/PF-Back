const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../../db.js")

const Reviews = sequelize.define(
  "Reviews",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    userId:{
      type: DataTypes.STRING,
      allowNull: false
    },
    productId:{
      type: DataTypes.STRING,
      allowNull: false
    },
    rating:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review:{
      type: DataTypes.TEXT,
      allowNull: false
    },
    banned:{
      type: DataTypes.BOOLEAN,
      allowNull: false
    }

  },
  {
    timestamps: true,
  }
);

module.exports = Reviews;