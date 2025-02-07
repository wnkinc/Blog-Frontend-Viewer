// routes/home.routes.js
const express = require("express");
const router = express.Router();
const {
  getHomepage,
  getUnderConstructionPage,
} = require("../controllers/home.controller");

router.get("/", getHomepage);
router.get("/underConstruction", getUnderConstructionPage);

module.exports = router;
