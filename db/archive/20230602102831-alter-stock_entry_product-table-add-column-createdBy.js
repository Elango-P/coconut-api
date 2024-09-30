'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('stock_entry_product');

    if (tableDefinition && !tableDefinition['store_id']) {
      await queryInterface.addColumn('stock_entry_product', 'store_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition['created_by']) {
      await queryInterface.addColumn('stock_entry_product', 'created_by', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('stock_entry_product');

    if (tableDefinition && tableDefinition['store_id']) {
      await queryInterface.removeColumn('stock_entry_product', 'store_id');
    }
    if (tableDefinition && !tableDefinition['created_by']) {
      await queryInterface.removeColumn('stock_entry_product', 'created_by', {});
    }
  },
};
