'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('account');

    if (tableDefinition && !tableDefinition['type']) {
      await queryInterface.addColumn('account', 'type', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('account');

    if (tableDefinition && tableDefinition['type']) {
      await queryInterface.removeColumn('account', 'type');
    }

  },
};
