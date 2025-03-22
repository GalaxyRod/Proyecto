'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Word extends Model {
    static associate(models) {
      // define associations here
    }
  }

  Word.init({
    word: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-zA-Z]+$/,
        len: [1, 50]
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'programming'
    },
    length: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue('word').length;
      }
    }
  }, {
    sequelize,
    modelName: 'Word',
    tableName: 'words',
    indexes: [
      {
        name: 'idx_word',
        fields: ['word']
      },
      {
        name: 'idx_category',
        fields: ['category']
      }
    ]
  });

  return Word;
};
