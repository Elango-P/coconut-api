'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering account_product table - Renaming column from margin_percentage to regular_margin_percentage");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("account_product");

      // Condition for renaming the column from margin_percentage to regular_margin_percentage if regular_margin_percentage column doesn't exist in the table
      if (tableDefinition && !tableDefinition["regular_margin_percentage"]) {
        await queryInterface.renameColumn("account_product", "margin_percentage", "regular_margin_percentage");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("account_product");
      
      // Condition for renaming the column from margin_percentage to regular_margin_percentage if regular_margin_percentage column exist in the table
      if (tableDefinition && tableDefinition["regular_margin_percentage"]) {
        await queryInterface.renameColumn("account_product", "regular_margin_percentage", "margin_percentage");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

