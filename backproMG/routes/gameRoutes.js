const express = require('express');
const router = express.Router();
const path = require('path');
const gamesController = require(path.join(__dirname, '..', 'controllers', 'gamesController'));

router.get('/', gamesController.getAllGames);

router.get('/:id', gamesController.getGameById);

router.post('/', gamesController.createGame);

router.put('/:id', gamesController.updateGame);

router.delete('/:id', gamesController.deleteGame);

module.exports = router;