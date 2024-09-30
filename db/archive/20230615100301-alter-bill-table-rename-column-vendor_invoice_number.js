'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering bill table - Renaming column from vendor_invoice_number to invoice_number");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("bill");

      // Condition for renaming the column from vendor_invoice_number to invoice_number if invoice_number column doesn't exist in the table
      if (tableDefinition && !tableDefinition["invoice_number"]) {
        await queryInterface.renameColumn("bill", "vendor_invoice_number", "invoice_number");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("bill");
      
      // Condition for renaming the column from vendor_invoice_number to invoice_number if created_by column exist in the table
      if (tableDefinition && tableDefinition["vendor_invoice_number"]) {
        await queryInterface.renameColumn("bill", "invoice_number", "vendor_invoice_number");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

