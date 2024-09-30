'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('bill');

    if (tableDefinition && !tableDefinition['invoice_amount']) {
      await queryInterface.addColumn('bill', 'invoice_amount', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('bill');

    if (tableDefinition && tableDefinition['invoice_amount']) {
      await queryInterface.removeColumn('bill', 'invoice_amount');
    }
  
  },
};

