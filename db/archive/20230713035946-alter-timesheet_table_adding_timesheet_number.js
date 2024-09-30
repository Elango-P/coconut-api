'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('timesheet');

    if (tableDefinition && !tableDefinition['timesheet_number']) {
      await queryInterface.addColumn('timesheet', 'timesheet_number', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('timesheet');

    if (tableDefinition && tableDefinition['timesheet_number']) {
      await queryInterface.removeColumn('timesheet', 'timesheet_number');
    }

  },
};

