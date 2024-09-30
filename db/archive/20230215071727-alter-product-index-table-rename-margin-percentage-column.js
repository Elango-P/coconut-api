'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering product_index table - Renaming column from margin_percentage to profit_percentage");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product_index");

      // Condition for renaming the column from margin_percentage to profit_percentage if profit_percentage column doesn't exist in the table
      if (tableDefinition && !tableDefinition["profit_percentage"]) {
        await queryInterface.renameColumn("product_index", "margin_percentage", "profit_percentage");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product_index");
      
      // Condition for renaming the column from profit_percentage to margin_percentage if profit_percentage column exist in the table
      if (tableDefinition && tableDefinition["profit_percentage"]) {
        await queryInterface.renameColumn("product_index", "profit_percentage", "margin_percentage");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
