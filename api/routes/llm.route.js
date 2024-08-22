const express = require("express");
const router = express.Router();
const { createIndex, uploadBook, queryChain } = require('../controllers/llm.controller.js');


router.get('/create', createIndex);
router.get('/uploadBook', uploadBook);
router.post('/query', queryChain);

module.exports = router;