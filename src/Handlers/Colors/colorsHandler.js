const colorsController = require("../../Controllers/Colors/colorsController");

const colorsHandler = () => {};

colorsHandler.createColor = async (req, res) => {
  const response = await colorsController.createColor(req.body);

  if (response.msg === "Color already exist") {
    res.status(500).json(response);
  } else {
    res.status(200).json(response);
  }
};

colorsHandler.deleteColor = async (req, res) => {
  const response = await colorsController.deleteColor(req.params.colorId);

  if (response.msg === "Color not found") {
    res.status(500).json(response);
  } else {
    res.status(200).json(response);
  }
};

colorsHandler.getAllColors = async (req, res) => {
  const response = await colorsController.getAllColors();

  res.status(200).json(response);
};

module.exports = colorsHandler;
