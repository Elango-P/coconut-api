'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('account');

    if (tableDefinition && !tableDefinition['payment_account']) {
      await queryInterface.addColumn('account', 'payment_account', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('account');

    if (tableDefinition && tableDefinition['payment_account']) {
      await queryInterface.removeColumn('account', 'payment_account');
    }
  
  },
};

