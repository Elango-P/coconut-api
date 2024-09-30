'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('account_type');

    if (tableDefinition && !tableDefinition['category']) {
      await queryInterface.addColumn('account_type', 'category', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('account_type');

    if (tableDefinition && tableDefinition['category']) {
      await queryInterface.removeColumn('account_type', 'category');
    }

  },
};

