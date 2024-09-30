'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('company');

    if (tableDefinition && !tableDefinition['time_zone']) {
      await queryInterface.addColumn('company', 'time_zone', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('company');

    if (tableDefinition && tableDefinition['time_zone']) {
      await queryInterface.removeColumn('company', 'time_zone');
    }

  },
};
