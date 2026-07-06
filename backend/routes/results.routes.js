const express = require('express');
const router = express.Router();
const resultsController = require('../controllers/results.controller');

router.get('/latest', resultsController.getLatestResult);

module.exports = router;
