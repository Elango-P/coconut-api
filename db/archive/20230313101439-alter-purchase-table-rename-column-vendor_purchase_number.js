'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering purchase table - Renaming column from vendor_purchase_number to vendor_invoice_number");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("purchase");

      // Condition for renaming the column from vendor_purchase_number to vendor_invoice_number if vendor_invoice_number column doesn't exist in the table
      if (tableDefinition && !tableDefinition["vendor_invoice_number"]) {
        await queryInterface.renameColumn("purchase", "vendor_purchase_number", "vendor_invoice_number");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("purchase");
      
      // Condition for renaming the column from vendor_invoice_number to vendor_purchase_number if vendor_invoice_number column exist in the table
      if (tableDefinition && tableDefinition["vendor_invoice_number"]) {
        await queryInterface.renameColumn("purchase", "vendor_invoice_number", "vendor_purchase_number");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
