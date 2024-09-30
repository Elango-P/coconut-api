'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add columns to the "purchase" table
    const tableDefinition = await queryInterface.describeTable("purchase");

    if (tableDefinition && !tableDefinition['returned_items_amount']) {
      await queryInterface.addColumn('purchase', 'returned_items_amount', {
        type: Sequelize.NUMERIC,
        allowNull: true,
      });
    }

    if (tableDefinition && !tableDefinition['other_deduction_amount']) {
      await queryInterface.addColumn('purchase', 'other_deduction_amount', {
        type: Sequelize.NUMERIC,
        allowNull: true,
      });
    }

    if (tableDefinition && !tableDefinition['cash_discount_percentage']) {
      await queryInterface.addColumn('purchase', 'cash_discount_percentage', {
        type: Sequelize.NUMERIC,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition['cash_discount_amount']) {
      await queryInterface.addColumn('purchase', 'cash_discount_amount', {
        type: Sequelize.NUMERIC,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition['invoice_amount']) {
      await queryInterface.addColumn('purchase', 'invoice_amount', {
        type: Sequelize.NUMERIC,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove columns from the "purchase" table in reverse order
    await queryInterface.removeColumn('purchase', 'invoice_amount');
    await queryInterface.removeColumn('purchase', 'cash_discount_amount');
    await queryInterface.removeColumn('purchase', 'cash_discount_percentage');
    await queryInterface.removeColumn('purchase', 'other_deduction_amount');
    await queryInterface.removeColumn('purchase', 'returned_items_amount');
  },
};
