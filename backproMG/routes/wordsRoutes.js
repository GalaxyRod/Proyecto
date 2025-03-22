const express = require('express');
const router = express.Router();
const path = require('path');
const wordsController = require(path.join(__dirname, '..', 'controllers', 'wordsController'));

router.get('/', wordsController.getWords);

router.get('/random', wordsController.getRandomWord);

router.post('/', wordsController.addWord);

router.post('/seed', wordsController.seedWords);

module.exports = router;
