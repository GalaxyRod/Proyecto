'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const programmingWords = [
      'angular', 'component', 'directive', 'service', 'pipe', 'module',
      'template', 'binding', 'injection', 'lifecycle', 'router',
      'observable', 'rxjs', 'signal', 'async', 'zoneJS',
      'javascript', 'typescript', 'interface', 'class', 'function',
      'promise', 'closure', 'hoisting', 'callback', 'scope',
      'prototype', 'decorator', 'parameter', 'variable', 'method',
      'frontend', 'backend', 'fullstack', 'database', 'framework',
      'library', 'package', 'browser', 'server', 'client',
      'request', 'response', 'route', 'middleware', 'endpoint',
      'http', 'webpack', 'syntax', 'compiler', 'runtime',
      'query', 'schema', 'model', 'migrate', 'relation',
      'postgres', 'sequelize', 'table', 'column', 'index',
      'git', 'docker', 'testing', 'debug', 'deploy',
      'agile', 'scrum', 'kanban', 'sprint', 'workflow'
    ];

    const now = new Date();
    const wordsToCreate = programmingWords.map(word => ({
      word: word.toLowerCase(),
      category: 'programming',
      createdAt: now,
      updatedAt: now
    }));

    return queryInterface.bulkInsert('words', wordsToCreate, {
      ignoreDuplicates: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('words', {
      word: {
        [Sequelize.Op.in]: [
          'angular', 'component', 'directive', 'service', 'pipe', 'module',
          'template', 'binding', 'injection', 'lifecycle', 'router',
          'observable', 'rxjs', 'signal', 'async', 'zonejs',
          'javascript', 'typescript', 'interface', 'class', 'function',
          'promise', 'closure', 'hoisting', 'callback', 'scope',
          'prototype', 'decorator', 'parameter', 'variable', 'method',
          'frontend', 'backend', 'fullstack', 'database', 'framework',
          'library', 'package', 'browser', 'server', 'client',
          'request', 'response', 'route', 'middleware', 'endpoint',
          'http', 'webpack', 'syntax', 'compiler', 'runtime',
          'query', 'schema', 'model', 'migrate', 'relation',
          'postgres', 'sequelize', 'table', 'column', 'index',
          'git', 'docker', 'testing', 'debug', 'deploy',
          'agile', 'scrum', 'kanban', 'sprint', 'workflow'
        ]
      }
    });
  }
};
