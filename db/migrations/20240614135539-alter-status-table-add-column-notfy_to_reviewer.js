'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('status');

    if (tableDefinition && !tableDefinition['notify_to_reviewer']) {
      await queryInterface.addColumn('status', 'notify_to_reviewer', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('status');

    if (tableDefinition && tableDefinition['notify_to_reviewer']) {
      await queryInterface.removeColumn('status', 'notify_to_reviewer');
    }

  },
};

