"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("invoice_product");

    if (tableDefinition && tableDefinition["sale_invoice_id"]) {
      return queryInterface.renameColumn(
        "invoice_product",
        "sale_invoice_id",
        "invoice_id"
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("invoice_product");

    if (tableDefinition && tableDefinition["invoice_id"]) {
      return queryInterface.renameColumn("invoice_product", "invoice_id", "sale_invoice_id");
    }
  },
};
