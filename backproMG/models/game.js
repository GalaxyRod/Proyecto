'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    static associate(models) {
      Game.belongsToMany(models.Genre, {
        through: 'GameGenres',
        foreignKey: 'gameId',
        otherKey: 'genreId',
        as: 'genres'
      });
    }
  }

  Game.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    }
  }, {
    sequelize,
    modelName: 'Game',
    tableName: 'games',
    indexes: [
      {
        name: 'idx_game_name',
        fields: ['name']
      }
    ]
  });

  return Game;
};
