"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Checking for existence of sale_invoice table...");
      const tableDefinition = await queryInterface.describeTable("sale_invoice");

      if (tableDefinition && tableDefinition["status"]) {
        await queryInterface.changeColumn("sale_invoice", "status", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
        console.log("Column 'status' changed to INTEGER successfully.");
      } else {
        console.log("Table 'sale_invoice' does not have a 'status' column or does not exist.");
      }
    } catch (error) {
      console.error("Error during migration:", error);
    }
  },
  
  down: async (queryInterface, Sequelize) => {
    try {
      console.log("Checking for existence of sale_invoice table...");
      const tableDefinition = await queryInterface.describeTable("sale_invoice");

      if (tableDefinition && tableDefinition["status"]) {
        await queryInterface.changeColumn("sale_invoice", "status", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
        console.log("Reverted column 'status' back to INTEGER successfully.");
      } else {
        console.log("Table 'sale_invoice' does not have a 'status' column or does not exist.");
      }
    } catch (error) {
      console.error("Error during rollback:", error);
    }
  },
};
