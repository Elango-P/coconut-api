'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('ticket_index');

    if (tableDefinition && !tableDefinition['component_id']) {
      await queryInterface.addColumn('ticket_index', 'component_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('ticket_index');

    if (tableDefinition && tableDefinition['component_id']) {
      await queryInterface.removeColumn('ticket_index', 'component_id');
    }

  },
};
