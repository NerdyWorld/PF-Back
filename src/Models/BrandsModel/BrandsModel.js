const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../../db.js")

const Brands = sequelize.define(
  "Brands",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false,
  }
);

module.exports = Brands;