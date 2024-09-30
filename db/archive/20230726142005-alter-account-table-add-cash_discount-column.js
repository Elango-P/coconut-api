'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('account');

    if (tableDefinition && !tableDefinition['cash_discount']) {
      await queryInterface.addColumn('account', 'cash_discount', {
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition['payment_terms']) {
      await queryInterface.addColumn('account', 'payment_terms', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition['return_terms']) {
      await queryInterface.addColumn('account', 'return_terms', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('account');

    if (tableDefinition && tableDefinition['cash_discount']) {
      await queryInterface.removeColumn('account', 'cash_discount');
    }
    if (tableDefinition && tableDefinition['payment_terms']) {
      await queryInterface.removeColumn('account', 'payment_terms');
    }
    if (tableDefinition && tableDefinition['return_terms']) {
      await queryInterface.removeColumn('account', 'return_terms');
    }

  },
};
