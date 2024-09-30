'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('app');

    if (tableDefinition && !tableDefinition['name_space']) {
      await queryInterface.addColumn('app', 'name_space', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('app');

    if (tableDefinition && tableDefinition['name_space']) {
      await queryInterface.removeColumn('app', 'name_space');
    }

  },
};

