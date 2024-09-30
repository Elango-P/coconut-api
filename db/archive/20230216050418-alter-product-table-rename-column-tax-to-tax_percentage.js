'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering product table - Renaming column from tax to tax_percentage");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product");

      // Condition for renaming the column from tax to tax_percentage if tax_percentage column doesn't exist in the table
      if (tableDefinition && !tableDefinition["tax_percentage"]) {
        await queryInterface.renameColumn("product", "tax", "tax_percentage");
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
      if (tableDefinition && tableDefinition["tax_percentage"]) {
        await queryInterface.renameColumn("product", "tax_percentage", "tax");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
