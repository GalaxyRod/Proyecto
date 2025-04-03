'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {
    static associate(models) {
      Genre.belongsToMany(models.Game, {
        through: 'GameGenres',
        foreignKey: 'genreId',
        otherKey: 'gameId',
        as: 'games'
      });
    }
  }

  Genre.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 50]
      }
    }
  }, {
    sequelize,
    modelName: 'Genre',
    tableName: 'genres',
    indexes: [
      {
        name: 'idx_genre_name',
        fields: ['name']
      }
    ]
  });

  return Genre;
};
