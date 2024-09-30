'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('timesheet');

    if (tableDefinition && !tableDefinition['total_hours']) {
      await queryInterface.addColumn('timesheet', 'total_hours', {
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('timesheet');

    if (tableDefinition && tableDefinition['time_hours']) {
      await queryInterface.removeColumn('timesheet', 'total_hours');
    }

  },
};
