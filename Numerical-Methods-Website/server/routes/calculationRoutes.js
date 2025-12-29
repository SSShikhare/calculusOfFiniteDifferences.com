const express = require('express');
const { calculateDifferences } = require('../controllers/calculationController');

const router = express.Router();

router.post('/calculate', calculateDifferences);

module.exports = router;
