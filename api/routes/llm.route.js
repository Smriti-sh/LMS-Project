const express = require("express");
const router = express.Router();
const { queryChain } = require('../controllers/llm.controller.js');
router.post('/query', queryChain);

module.exports = router;