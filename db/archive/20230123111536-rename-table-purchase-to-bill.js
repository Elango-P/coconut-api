'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Renaming table from purchase to bill");

      // Defining the purchase table value if the table exists already or not.
      const purchaseTableDefinition = await queryInterface.tableExists("purchase");

      // Defining the bill table value if the table exists already or not.
      const billTableDefinition = await queryInterface.tableExists("bill");

      // Condition for renaming the table from purchase to bill only if purchase table exists and bill table doesn't exist.
      if (purchaseTableDefinition && !billTableDefinition) {
        await queryInterface.renameTable("purchase", "bill");
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the purchase table value if the table exists already or not.
      const purchaseTableDefinition = await queryInterface.tableExists("purchase");

      // Defining the bill table value if the table exists already or not.
      const billTableDefinition = await queryInterface.tableExists("bill");

      // Condition for renaming the table from bill to purchase only if bill table exists and purchase table doesn't exist.
      if (billTableDefinition && !purchaseTableDefinition) {
        await queryInterface.renameTable("bill", "purchase");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
