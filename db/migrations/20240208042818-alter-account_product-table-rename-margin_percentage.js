'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering account_product table - Renaming column from cost_price to last_purchased_price");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("account_product");

      // Condition for renaming the column from cost_price to last_purchased_price if it exists
      if (tableDefinition && tableDefinition["cost_price"]) {
        await queryInterface.renameColumn("account_product", "cost_price", "last_purchased_price");
        console.log("Renamed column 'cost_price' to 'last_purchased_price'.");
      } else {
        console.log("Column 'cost_price' does not exist; skipping rename.");
      }
     
      // Condition for adding last_purchased_margin_percentage if it doesn't exist
      if (tableDefinition && !tableDefinition["last_purchased_margin_percentage"]) {
        await queryInterface.addColumn("account_product", "last_purchased_margin_percentage", {
          type: Sequelize.STRING,
        });
        console.log("Added column 'last_purchased_margin_percentage'.");
      }
    } catch (err) {
      console.error("Error during migration:", err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("account_product");

      // Condition for renaming the column back to cost_price if last_purchased_price exists
      if (tableDefinition && tableDefinition["last_purchased_price"]) {
        await queryInterface.renameColumn("account_product", "last_purchased_price", "cost_price");
        console.log("Renamed column 'last_purchased_price' back to 'cost_price'.");
      } else {
        console.log("Column 'last_purchased_price' does not exist; skipping rename.");
      }

      // Condition for removing last_purchased_margin_percentage if it exists
      if (tableDefinition && tableDefinition["last_purchased_margin_percentage"]) {
        await queryInterface.removeColumn("account_product", "last_purchased_margin_percentage");
        console.log("Removed column 'last_purchased_margin_percentage'.");
      } else {
        console.log("Column 'last_purchased_margin_percentage' does not exist; skipping removal.");
      }
    } catch (err) {
      console.error("Error during rollback:", err);
    }
  }
};
