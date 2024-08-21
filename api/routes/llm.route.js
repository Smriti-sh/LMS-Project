const express = require("express");
const router = express.Router();
const {createIndex} = require('../controllers/llm.controller.js');


router.get('/create', createIndex);

module.exports = router;