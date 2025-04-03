const express = require('express');
const router = express.Router();
const path = require('path');
const genresController = require(path.join(__dirname, '..', 'controllers', 'genresController'));

router.get('/', genresController.getAllGenres);

router.get('/:id', genresController.getGenreById);

router.get('/:id/games', genresController.getGamesByGenre);

router.post('/', genresController.createGenre);

router.put('/:id', genresController.updateGenre);

router.delete('/:id', genresController.deleteGenre);

module.exports = router;