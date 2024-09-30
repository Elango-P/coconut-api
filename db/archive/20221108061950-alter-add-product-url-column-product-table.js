"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");
    if (tableDefinition && !tableDefinition["vendor_url"]) {
      await queryInterface.addColumn("product", "vendor_url", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");
    if (tableDefinition && tableDefinition["vendor_url"]) {
      await queryInterface.removeColumn("product", "vendor_url");
    }
  }
};