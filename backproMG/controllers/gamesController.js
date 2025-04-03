const path = require('path');
const db = require(path.join(__dirname, '..', 'models'));

exports.getAllGames = async (req, res, next) => {
    try {
        const games = await db.Game.findAll({
            include: [
                {
                    model: db.Genre,
                    as: 'genres',
                    through: { attributes: [] }
                }
            ]
        });

        res.status(200).json({
            success: true,
            count: games.length,
            data: games
        });
    } catch (error) {
        next(error);
    }
};

exports.getGameById = async (req, res, next) => {
    try {
        const game = await db.Game.findByPk(req.params.id, {
            include: [
                {
                    model: db.Genre,
                    as: 'genres',
                    through: { attributes: [] }
                }
            ]
        });

        if (!game) {
            return res.status(404).json({
                success: false,
                message: 'Game not found'
            });
        }

        res.status(200).json({
            success: true,
            data: game
        });
    } catch (error) {
        next(error);
    }
};

exports.createGame = async (req, res, next) => {
    try {
        const { name, description, imageUrl, genreIds } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name and description for the game'
            });
        }

        const transaction = await db.sequelize.transaction();

        try {
            const game = await db.Game.create(
                {
                    name,
                    description,
                    imageUrl
                },
                { transaction }
            );

            if (genreIds && Array.isArray(genreIds) && genreIds.length > 0) {
                const genres = await db.Genre.findAll({
                    where: { id: genreIds },
                    transaction
                });

                if (genres.length !== genreIds.length) {
                    await transaction.rollback();
                    return res.status(400).json({
                        success: false,
                        message: 'One or more genres do not exist'
                    });
                }

                await game.setGenres(genres, { transaction });
            }

            await transaction.commit();

            const createdGame = await db.Game.findByPk(game.id, {
                include: [{ model: db.Genre, as: 'genres', through: { attributes: [] } }]
            });

            res.status(201).json({
                success: true,
                data: createdGame
            });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        next(error);
    }
};

exports.updateGame = async (req, res, next) => {
    try {
        const { name, description, imageUrl, genreIds } = req.body;
        const game = await db.Game.findByPk(req.params.id);

        if (!game) {
            return res.status(404).json({
                success: false,
                message: 'Game not found'
            });
        }

        const transaction = await db.sequelize.transaction();

        try {
            await game.update(
                {
                    name: name || game.name,
                    description: description || game.description,
                    imageUrl: imageUrl !== undefined ? imageUrl : game.imageUrl
                },
                { transaction }
            );

            if (genreIds && Array.isArray(genreIds)) {
                const genres = await db.Genre.findAll({
                    where: { id: genreIds },
                    transaction
                });

                if (genres.length !== genreIds.length) {
                    await transaction.rollback();
                    return res.status(400).json({
                        success: false,
                        message: 'One or more genres do not exist'
                    });
                }

                await game.setGenres(genres, { transaction });
            }

            await transaction.commit();

            const updatedGame = await db.Game.findByPk(game.id, {
                include: [{ model: db.Genre, as: 'genres', through: { attributes: [] } }]
            });

            res.status(200).json({
                success: true,
                data: updatedGame
            });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        next(error);
    }
};

exports.deleteGame = async (req, res, next) => {
    try {
        const game = await db.Game.findByPk(req.params.id);

        if (!game) {
            return res.status(404).json({
                success: false,
                message: 'Game not found'
            });
        }

        await game.destroy();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
