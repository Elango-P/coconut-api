"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_price");
    if (tableDefinition && !tableDefinition["date"]) {
      await queryInterface.addColumn("product_price", "date", {
        type: Sequelize.DATEONLY,
        allowNull: true,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_price");
    if (tableDefinition && tableDefinition["product_price"]) {
      await queryInterface.removeColumn("product_price", "date");
    }
  },
};