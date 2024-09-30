'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering the bill table - Renaming the column from purchase_date to bill_date");

      // Defining the bill table value if the table exists or not.
      const billTableExists = await queryInterface.tableExists("bill");

      // Condition for altering the table only if the table is already exists.
      if (billTableExists) {
        // Defining the table
        const billTableDefinition = await queryInterface.describeTable("bill");

        // Condition for renaming the column from purchase_date to bill_date only when if the purchase_date column exist and bill_date column doesn't exist.
        if (billTableDefinition && billTableDefinition["purchase_date"] && !billTableDefinition["bill_date"]) {
          await queryInterface.renameColumn("bill", "purchase_date", "bill_date");
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

        // Condition for renaming the column from bill_date to purchase_date only when if the bill_date column exist and purchase_date column doesn't exist.
        if (billTableDefinition && billTableDefinition["bill_date"] && !billTableDefinition["purchase_date"]) {
          await queryInterface.renameColumn("bill", "bill_date", "purchase_date");
        };
      };
    } catch (err) {
      console.log(err);
    };
  }
};
