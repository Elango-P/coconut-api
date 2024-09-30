"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("supplier_product");
    if (tableDefinition && tableDefinition["supplier_id"]) {
      return queryInterface.renameColumn(
        "supplier_product",
        "supplier_id",
        "vendor_id"
      );
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("supplier_product");
    if (tableDefinition && tableDefinition["shopify_status"]) {
      return queryInterface.renameColumn("product", "vendor_id", "supplier_id");
    }
  },
};