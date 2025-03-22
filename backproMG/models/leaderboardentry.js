'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LeaderboardEntry extends Model {
    static associate(models) {
      // define associations here
    }
  }

  LeaderboardEntry.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'LeaderboardEntry',
    tableName: 'leaderboard_entries',
    indexes: [
      {
        name: 'idx_score',
        fields: ['score']
      }
    ]
  });

  return LeaderboardEntry;
};
