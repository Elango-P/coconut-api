"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const tableDefinition = await queryInterface.describeTable("stock_entry_product");

      if (tableDefinition && !tableDefinition["product_id"]) {
        await queryInterface.addColumn("stock_entry_product", "product_id", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("stock_entry_product");

    if (tableDefinition && tableDefinition["product_id"]) {
      await queryInterface.removeColumn("stock_entry_product", "product_id");
    }
  },
};
