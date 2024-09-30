"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("location_product");

    if (tableDefinition && tableDefinition["location_product_id"]) {
      await queryInterface.removeColumn("location_product", "location_product_id");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("location_product");

    if (tableDefinition && !tableDefinition["location_product_id"]) {
      await queryInterface.addColumn("location_product", "location_product_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },
};
