'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering product_index table - Renaming column from margin_amount to profit_amount");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product_index");

      // Condition for renaming the column from margin_amount to profit_amount if profit_amount column doesn't exist in the table
      if (tableDefinition && !tableDefinition["profit_amount"]) {
        await queryInterface.renameColumn("product_index", "margin_amount", "profit_amount");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product_index");
      
      // Condition for renaming the column from profit_amount to margin_amount if profit_amount column exist in the table
      if (tableDefinition && tableDefinition["profit_amount"]) {
        await queryInterface.renameColumn("product_index", "profit_amount", "margin_amount");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
