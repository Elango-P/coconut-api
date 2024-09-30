'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Renaming table from purchase_media to bill_media");

      // Defining the purchase_media table value if the table exists already or not.
      const purchaseMediaTableDefinition = await queryInterface.tableExists("purchase_media");

      // Defining the bill_media table value if the table exists already or not.
      const billMediaTableDefinition = await queryInterface.tableExists("bill_media");

      // Condition for renaming the table from purchase_media to bill_media only if purchase_media table exists and bill_media table doesn't exist.
      if (purchaseMediaTableDefinition && !billMediaTableDefinition) {
        await queryInterface.renameTable("purchase_media", "bill_media");
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the purchase_media table value if the table exists already or not.
      const purchaseMediaTableDefinition = await queryInterface.tableExists("purchase_media");

      // Defining the bill_media table value if the table exists already or not.
      const billMediaTableDefinition = await queryInterface.tableExists("bill_media");

      // Condition for renaming the table from bill_media to purchase_media only if bill_media table exists and purchase_media table doesn't exist.
      if (billMediaTableDefinition && !purchaseMediaTableDefinition) {
        await queryInterface.renameTable("bill_media", "purchase_media");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
