'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('test_case', 'ticket_test_case');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('ticket_test_case', 'test_case');
  }
};
