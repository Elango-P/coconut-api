'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('order_product');

    if (tableDefinition && !tableDefinition['manual_price']) {
      await queryInterface.addColumn('order_product', 'manual_price', {
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('order_product');

    if (tableDefinition && tableDefinition['manual_price']) {
      await queryInterface.removeColumn('order_product', 'manual_price');
    }

  },
};

