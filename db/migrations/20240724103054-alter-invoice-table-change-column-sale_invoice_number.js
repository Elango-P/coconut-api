"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable(
      "invoice_product"
    );

    if (tableDefinition && tableDefinition["sale_invoice_number"]) {
      return queryInterface.renameColumn(
        "invoice_product",
        "sale_invoice_number",
        "invoice_number"
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable(
      "invoice_product"
    );

    if (tableDefinition && tableDefinition["invoice_number"]) {
      return queryInterface.renameColumn(
        "invoice_product",
        "invoice_number",
        "sale_invoice_number"
      );
    }
  },
};
