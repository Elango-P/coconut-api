'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering product table - Renaming column from accountname to payment_account_name");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("payment_account");

      // Condition for renaming the column from tax to tax_percentage if tax_percentage column doesn't exist in the table
      if (tableDefinition && !tableDefinition["payment_account_name"]) {
        await queryInterface.renameColumn("payment_account", "account_name", "payment_account_name");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product");
      
      // Condition for renaming the column from tax_percentage to tax if tax_percentage column exist in the table
      if (tableDefinition && tableDefinition["payment_account_name"]) {
        await queryInterface.renameColumn("payment_account", "payment_account_name", "account_name");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
