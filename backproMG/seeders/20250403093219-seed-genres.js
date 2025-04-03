// @ts-nocheck
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('genres', [
      {
        name: 'Arcade',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Puzzle',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Strategy',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Action',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Classic',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Skill',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Typing',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Educational',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Retro',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('genres', null, {});
  }
};
