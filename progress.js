const express = require('express');
const router = express.Router();
const { updateProgress, getProgress } = require('../controllers/progresscontroller');

router.post('/', updateProgress); // POST /api/progress
router.get('/:userId', getProgress); // GET /api/progress/:userId

module.exports = router;
