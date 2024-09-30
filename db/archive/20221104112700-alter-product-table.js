"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const tableDefinition = await queryInterface.describeTable("product");

      const productIndexTableDefinition = await queryInterface.describeTable("product_index");

      if (tableDefinition && !tableDefinition["allow_transfer_out_of_stock"]) {
        await queryInterface.addColumn("product", "allow_transfer_out_of_stock", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }

      if (productIndexTableDefinition && !productIndexTableDefinition["allow_transfer_out_of_stock"]) {
        await queryInterface.addColumn("product_index", "allow_transfer_out_of_stock", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    
    const tableDefinition = await queryInterface.describeTable("product");

    const productIndexTableDefinition = await queryInterface.describeTable("product_index");

    if (tableDefinition && tableDefinition["allow_transfer_out_of_stock"]) {
      await queryInterface.removeColumn("product", "allow_transfer_out_of_stock");
    }

    if (productIndexTableDefinition && productIndexTableDefinition["allow_transfer_out_of_stock"]) {
      await queryInterface.removeColumn("product_index", "allow_transfer_out_of_stock");
    }
  },
};
