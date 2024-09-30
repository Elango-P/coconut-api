"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_product");
    if (tableDefinition && !tableDefinition["store_id"]) {
      await queryInterface.addColumn("order_product", "store_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_product");

    if (tableDefinition && tableDefinition["store_id"]) {
      await queryInterface.removeColumn("order_product", "store_id");
    }
  }
};

