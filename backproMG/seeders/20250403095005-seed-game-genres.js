// @ts-nocheck
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const games = await queryInterface.sequelize.query(
      `SELECT id, name FROM games;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const genres = await queryInterface.sequelize.query(
      `SELECT id, name FROM genres;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const gameMap = {};
    games.forEach(game => {
      gameMap[game.name] = game.id;
    });

    const genreMap = {};
    genres.forEach(genre => {
      genreMap[genre.name] = genre.id;
    });

    const gameGenres = [
      { gameId: gameMap['Pacman'], genreId: genreMap['Arcade'] },
      { gameId: gameMap['Pacman'], genreId: genreMap['Classic'] },
      { gameId: gameMap['Pacman'], genreId: genreMap['Action'] },
      { gameId: gameMap['Pacman'], genreId: genreMap['Retro'] },

      { gameId: gameMap['Type Game'], genreId: genreMap['Typing'] },
      { gameId: gameMap['Type Game'], genreId: genreMap['Educational'] },
      { gameId: gameMap['Type Game'], genreId: genreMap['Skill'] },

      { gameId: gameMap['Snake'], genreId: genreMap['Arcade'] },
      { gameId: gameMap['Snake'], genreId: genreMap['Classic'] },
      { gameId: gameMap['Snake'], genreId: genreMap['Strategy'] },
      { gameId: gameMap['Snake'], genreId: genreMap['Retro'] }
    ];

    const gameGenresWithTimestamps = gameGenres.map(relation => ({
      ...relation,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('game_genres', gameGenresWithTimestamps, {
      ignoreDuplicates: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('game_genres', null, {});
  }
};
