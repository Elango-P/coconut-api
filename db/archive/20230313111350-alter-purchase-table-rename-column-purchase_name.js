'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering purchase table - Renaming column from purchase_name to billing_name");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("purchase");

      // Condition for renaming the column from purchase_name to billing_name if billing_name column doesn't exist in the table
      if (tableDefinition && !tableDefinition["billing_name"]) {
        await queryInterface.renameColumn("purchase", "purchase_name", "billing_name");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("purchase");
      
      // Condition for renaming the column from billing_name to purchase_name if billing_name column exist in the table
      if (tableDefinition && tableDefinition["billing_name"]) {
        await queryInterface.renameColumn("purchase", "billing_name", "purchase_name");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
