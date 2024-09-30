'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_product");
    if (tableDefinition && !tableDefinition["sales_coin"]) {
      await queryInterface.addColumn("order_product", "sales_coin", {
          type: Sequelize.INTEGER,
          allowNull: true,
      });
    }
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_product");
    if (tableDefinition && tableDefinition["sales_coin"]) {
      await queryInterface.removeColumn("order_product", "sales_coin");
    }
  },
};
