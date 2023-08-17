require("dotenv").config();

const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const sequelize = require("./db");
const router = require("./Router/mainRouter");
const port = process.env.PORT || 3001
const app = express();
const { 
  Users, 
  Products, 
  Orders, 
  Reviews, 
  Colors, 
  Categories, 
  Brands 
} = require("./Models/Relations")




// MIDDLEWARES
app.use(express.json());
app.use(logger("dev"));
app.use(cors());


// MAIN ROUTER
app.use('/api', router)



// SEQUELIZE
sequelize.sync({force: false})
  .then(() => {
    app.listen(port, () => {
      console.log("Server running on Railway")
    })
  })
  .catch((error) => {
    console.log(error)
  })

  app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || err;
    console.error(err);
    res.status(status).send(message);
  });
