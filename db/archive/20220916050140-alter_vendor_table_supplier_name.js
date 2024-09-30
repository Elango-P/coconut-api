"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("vendor");
    if (tableDefinition && tableDefinition["supplier_name"]) {
      return queryInterface.renameColumn(
        "vendor",
        "supplier_name",
        "vendor_name"
      );
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("vendor");
    if (tableDefinition && tableDefinition["shopify_status"]) {
      return queryInterface.renameColumn("product", "vendor_name", "supplier_name");
    }
  },
};