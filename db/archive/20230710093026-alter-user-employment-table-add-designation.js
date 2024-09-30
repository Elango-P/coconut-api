'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('user_employment');

    if (tableDefinition && !tableDefinition['designation']) {
      await queryInterface.addColumn('user_employment', 'designation', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('user_employment');

    if (tableDefinition && tableDefinition['designation']) {
      await queryInterface.removeColumn('user_employment', 'designation');
    }
  
  },
};

