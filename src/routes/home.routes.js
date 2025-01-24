// routes/home.routes.js
const express = require("express");
const router = express.Router();
const { getHomepage } = require("../controllers/home.controller");

router.get("/", getHomepage);

module.exports = router;
