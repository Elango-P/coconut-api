'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_index");
    if (tableDefinition && !tableDefinition["sales_coin"]) {
      await queryInterface.addColumn("product_index", "sales_coin", {
          type: Sequelize.INTEGER,
          allowNull: true,
      });
    }
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_index");
    if (tableDefinition && tableDefinition["sales_coin"]) {
      await queryInterface.removeColumn("product_index", "sales_coin");
    }
  },
};
