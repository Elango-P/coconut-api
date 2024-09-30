'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('fine', 'fine_bonus');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('fine_bonus', 'fine');
  }
};
