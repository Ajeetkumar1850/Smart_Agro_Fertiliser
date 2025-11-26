const express = require("express");
const router = express.Router();
const { askGemini } = require("../controllers/gemini");

router.post("/gemini", askGemini); 

module.exports = router;
