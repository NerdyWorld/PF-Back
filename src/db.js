require("dotenv").config();

const { Sequelize } = require("sequelize");

const { DB_DEPLOY } = process.env;

const sequelize = new Sequelize(
  DB_DEPLOY,
  {
  logging: false,
  native: false,
})

module.exports = sequelize;
