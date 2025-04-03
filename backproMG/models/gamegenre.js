'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GameGenre extends Model {
    static associate(models) {
      // define association here
    }
  }

  GameGenre.init({
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'games',
        key: 'id'
      }
    },
    genreId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'genres',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'GameGenre',
    tableName: 'game_genres'
  });

  return GameGenre;
};
