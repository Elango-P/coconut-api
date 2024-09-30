"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable(
      "invoice_product"
    );

    if (tableDefinition && tableDefinition["sale_invoice_date"]) {
      return queryInterface.renameColumn(
        "invoice_product",
        "sale_invoice_date",
        "invoice_date"
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable(
      "invoice_product"
    );

    if (tableDefinition && tableDefinition["invoice_date"]) {
      return queryInterface.renameColumn(
        "invoice_product",
        "invoice_date",
        "sale_invoice_date"
      );
    }
  },
};
