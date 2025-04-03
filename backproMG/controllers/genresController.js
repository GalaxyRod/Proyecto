const path = require('path');
const db = require(path.join(__dirname, '..', 'models'));

exports.getAllGenres = async (req, res, next) => {
    try {
        const genres = await db.Genre.findAll();

        res.status(200).json({
            success: true,
            count: genres.length,
            data: genres
        });
    } catch (error) {
        next(error);
    }
};

exports.getGenreById = async (req, res, next) => {
    try {
        const genre = await db.Genre.findByPk(req.params.id, {
            include: [
                {
                    model: db.Game,
                    as: 'games',
                    through: { attributes: [] }
                }
            ]
        });

        if (!genre) {
            return res.status(404).json({
                success: false,
                message: 'Genre not found'
            });
        }

        res.status(200).json({
            success: true,
            data: genre
        });
    } catch (error) {
        next(error);
    }
};

exports.createGenre = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a name for the genre'
            });
        }

        const existingGenre = await db.Genre.findOne({ where: { name } });
        if (existingGenre) {
            return res.status(400).json({
                success: false,
                message: 'Genre with this name already exists'
            });
        }

        const genre = await db.Genre.create({ name });

        res.status(201).json({
            success: true,
            data: genre
        });
    } catch (error) {
        next(error);
    }
};

exports.updateGenre = async (req, res, next) => {
    try {
        const { name } = req.body;
        const genre = await db.Genre.findByPk(req.params.id);

        if (!genre) {
            return res.status(404).json({
                success: false,
                message: 'Genre not found'
            });
        }

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a name for the genre'
            });
        }

        if (name !== genre.name) {
            const existingGenre = await db.Genre.findOne({ where: { name } });
            if (existingGenre) {
                return res.status(400).json({
                    success: false,
                    message: 'Genre with this name already exists'
                });
            }
        }

        await genre.update({ name });

        res.status(200).json({
            success: true,
            data: genre
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteGenre = async (req, res, next) => {
    try {
        const genre = await db.Genre.findByPk(req.params.id);

        if (!genre) {
            return res.status(404).json({
                success: false,
                message: 'Genre not found'
            });
        }

        await genre.destroy();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

exports.getGamesByGenre = async (req, res, next) => {
    try {
        const genre = await db.Genre.findByPk(req.params.id);

        if (!genre) {
            return res.status(404).json({
                success: false,
                message: 'Genre not found'
            });
        }

        const games = await genre.getGames();

        res.status(200).json({
            success: true,
            count: games.length,
            data: games
        });
    } catch (error) {
        next(error);
    }
};
