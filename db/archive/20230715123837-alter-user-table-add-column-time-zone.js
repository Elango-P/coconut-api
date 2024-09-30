'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('user');

    if (tableDefinition && !tableDefinition['time_zone']) {
      await queryInterface.addColumn('user', 'time_zone', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('user');

    if (tableDefinition && tableDefinition['time_zone']) {
      await queryInterface.removeColumn('user', 'time_zone');
    }

  },
};
