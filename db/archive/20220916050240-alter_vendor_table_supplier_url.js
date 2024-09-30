"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("vendor");
    if (tableDefinition && tableDefinition["supplier_url"]) {
      return queryInterface.renameColumn(
        "vendor",
        "supplier_url",
        "vendor_url"
      );
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("vendor");
    if (tableDefinition && tableDefinition["shopify_status"]) {
      return queryInterface.renameColumn("product", "vendor_url", "supplier_url");
    }
  },
};