'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('system_log', 'history');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('history', 'system_log');
  }
};
