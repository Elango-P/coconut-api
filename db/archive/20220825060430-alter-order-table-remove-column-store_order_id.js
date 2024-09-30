"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order");

    if (tableDefinition && tableDefinition["store_order_id"]) {
      await queryInterface.removeColumn("order", "store_order_id");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order");

    if (tableDefinition && !tableDefinition["store_order_id"]) {
      await queryInterface.addColumn("order", "store_order_id", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
