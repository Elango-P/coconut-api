'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering the bill_product table - Renaming the column from purchase_id to bill_id");

      // Defining the bill_product table value if the table exists or not.
      const billProductTableExists = await queryInterface.tableExists("bill_product");

      // Condition for altering the table only if the table is already exists.
      if (billProductTableExists) {
        // Defining the table
        const billProductTableDefinition = await queryInterface.describeTable("bill_product");

        // Condition for renaming the column from purchase_id to bill_id only when if the purchase_id column exist and bill_id column doesn't exist.
        if (billProductTableDefinition && billProductTableDefinition["purchase_id"] && !billProductTableDefinition["bill_id"]) {
          await queryInterface.renameColumn("bill_product", "purchase_id", "bill_id");
        };
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the bill_product table value if the table exists or not.
      const billProductTableExists = await queryInterface.tableExists("bill_product");

      // Condition for altering the table only if the table is already exists.
      if (billProductTableExists) {
        // Defining the table
        const billProductTableDefinition = await queryInterface.describeTable("bill_product");

        // Condition for renaming the column from bill_id to purchase_id only when if the bill_id column exist and purchase_id column doesn't exist.
        if (billProductTableDefinition && billProductTableDefinition["bill_id"] && !billProductTableDefinition["purchase_id"]) {
          await queryInterface.renameColumn("bill_product", "bill_id", "purchase_id");
        };
      };
    } catch (err) {
      console.log(err);
    };
  }
};
