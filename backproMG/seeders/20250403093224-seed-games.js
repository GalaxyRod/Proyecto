// @ts-nocheck
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('games', [
      {
        name: 'Pacman',
        description: 'Sumérgete en el mundo de Pacman, donde la estrategia y la velocidad son clave. ¿Podrás alcanzar la puntuación más alta?',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Pacman.PNG',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Type Game',
        description: 'Demuestra tus habilidades de mecanografía en este emocionante desafío. ¿Eres lo suficientemente rápido para superar todos los niveles?',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Artificial_Intelligence_Word_Cloud.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Snake',
        description: 'Un clásico juego de estrategia y reflejos. Guía a la serpiente para que coma y crezca, pero cuidado con los obstáculos.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Cgasnake.png',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('games', null, {});
  }
};
