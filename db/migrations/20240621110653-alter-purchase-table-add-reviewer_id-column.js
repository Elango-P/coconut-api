'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('purchase');

    if (tableDefinition && !tableDefinition['reviewer_id']) {
      await queryInterface.addColumn('purchase', 'reviewer_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('purchase');

    if (tableDefinition && tableDefinition['reviewer_id']) {
      await queryInterface.removeColumn('purchase', 'reviewer_id');
    }

  },
};

