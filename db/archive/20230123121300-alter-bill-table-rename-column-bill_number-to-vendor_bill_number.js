'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering the bill table - Renaming the column from bill_number to vendor_bill_number");

      // Defining the bill table value if the table exists or not.
      const billTableExists = await queryInterface.tableExists("bill");

      // Condition for altering the table only if the table is already exists.
      if (billTableExists) {
        // Defining the table
        const billTableDefinition = await queryInterface.describeTable("bill");

        // Condition for renaming the column from bill_number to vendor_bill_number only when if the bill_number column exist and vendor_bill_number column doesn't exist.
        if (billTableDefinition && billTableDefinition["bill_number"] && !billTableDefinition["vendor_bill_number"]) {
          await queryInterface.renameColumn("bill", "bill_number", "vendor_bill_number");
        };
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the bill table value if the table exists or not.
      const billTableExists = await queryInterface.tableExists("bill");

      // Condition for altering the table only if the table is already exists.
      if (billTableExists) {
        // Defining the table
        const billTableDefinition = await queryInterface.describeTable("bill");

        // Condition for renaming the column from vendor_bill_number to bill_number only when if the vendor_bill_number column exist and bill_number column doesn't exist.
        if (billTableDefinition && billTableDefinition["vendor_bill_number"] && !billTableDefinition["bill_number"]) {
          await queryInterface.renameColumn("bill", "vendor_bill_number", "bill_number");
        };
      };
    } catch (err) {
      console.log(err);
    };
  }
};
