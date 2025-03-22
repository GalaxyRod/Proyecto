const express = require('express');
const router = express.Router();
const path = require('path');
const leaderboardController = require(path.join(__dirname, '..', 'controllers', 'leaderboardController'));

router.get('/', leaderboardController.getScores);

router.post('/', leaderboardController.addScore);

router.get('/:id', leaderboardController.getScoreById);

router.delete('/:id', leaderboardController.deleteScore);

module.exports = router;
