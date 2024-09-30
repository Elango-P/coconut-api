'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('status');

    if (tableDefinition && !tableDefinition['project_id']) {
      await queryInterface.addColumn('status', 'project_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('status');

    if (tableDefinition && tableDefinition['project_id']) {
      await queryInterface.removeColumn('status', 'project_id');
    }

  },
};
