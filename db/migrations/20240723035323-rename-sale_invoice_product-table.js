"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check for the existence of the sale_invoice_product table
      console.log("Checking for existence of sale_invoice_product table...");
      const tableExists = await queryInterface.describeTable("sale_invoice_product").catch(() => null);
      
      if (tableExists) {
        console.log("Renaming sale_invoice_product table to invoice_product");
        await queryInterface.renameTable("sale_invoice_product", "invoice_product");
        console.log("Successfully renamed table to invoice_product");
      } else {
        console.log("Table sale_invoice_product does not exist.");
      }
    } catch (error) {
      console.error("Error during migration:", error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      console.log("Checking for existence of invoice_product table...");
      const tableExists = await queryInterface.describeTable("invoice_product").catch(() => null);
      
      if (tableExists) {
        console.log("Renaming invoice_product table back to sale_invoice_product");
        await queryInterface.renameTable("invoice_product", "sale_invoice_product");
        console.log("Successfully renamed table back to sale_invoice_product");
      } else {
        console.log("Table invoice_product does not exist.");
      }
    } catch (error) {
      console.error("Error during rollback:", error);
    }
  },
};
