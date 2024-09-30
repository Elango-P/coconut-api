"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("invoice");

    if (tableDefinition && tableDefinition["sale_invoice_number"]) {
      return queryInterface.renameColumn(
        "invoice",
        "sale_invoice_number",
        "invoice_number"
      );
    }
   
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("invoice");

    if (tableDefinition && tableDefinition["invoice_number"]) {
      return queryInterface.renameColumn("invoice", "invoice_number", "sale_invoice_number");
    }
   
  },
};
