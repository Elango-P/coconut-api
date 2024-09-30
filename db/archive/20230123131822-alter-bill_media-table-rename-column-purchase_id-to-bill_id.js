'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering the bill_media table - Renaming the column from purchase_id to bill_id");

      // Defining the bill_media table value if the table exists or not.
      const billMediaTableExists = await queryInterface.tableExists("bill_media");

      // Condition for altering the table only if the table is already exists.
      if (billMediaTableExists) {
        // Defining the table
        const billMediaTableDefinition = await queryInterface.describeTable("bill_media");

        // Condition for renaming the column from purchase_id to bill_id only when if the purchase_id column exist and bill_id column doesn't exist.
        if (billMediaTableDefinition && billMediaTableDefinition["purchase_id"] && !billMediaTableDefinition["bill_id"]) {
          await queryInterface.renameColumn("bill_media", "purchase_id", "bill_id");
        };
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the bill_media table value if the table exists or not.
      const billMediaTableExists = await queryInterface.tableExists("bill_media");

      // Condition for altering the table only if the table is already exists.
      if (billMediaTableExists) {
        // Defining the table
        const billMediaTableDefinition = await queryInterface.describeTable("bill_media");

        // Condition for renaming the column from bill_id to purchase_id only when if the bill_id column exist and purchase_id column doesn't exist.
        if (billMediaTableDefinition && billMediaTableDefinition["bill_id"] && !billMediaTableDefinition["purchase_id"]) {
          await queryInterface.renameColumn("bill_media", "bill_id", "purchase_id");
        };
      };
    } catch (err) {
      console.log(err);
    };
  }
};
