'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('ticket_index');

    if (tableDefinition && !tableDefinition['status_group_id']) {
      await queryInterface.addColumn('ticket_index', 'status_group_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('ticket_index');

    if (tableDefinition && tableDefinition['status_group_id']) {
      await queryInterface.removeColumn('ticket_index', 'status_group_id');
    }

  },
};
