'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('payment');

    if (tableDefinition && !tableDefinition['notes']) {
      await queryInterface.addColumn('payment', 'notes', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('payment');

    if (tableDefinition && tableDefinition['notes']) {
      await queryInterface.removeColumn('payment', 'notes');
    }

  },
};
