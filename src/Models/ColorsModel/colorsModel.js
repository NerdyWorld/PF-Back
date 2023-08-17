const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../../db.js")

const Colors = sequelize.define(
  "Colors",
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

module.exports = Colors;